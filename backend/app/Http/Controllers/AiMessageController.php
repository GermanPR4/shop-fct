<?php

namespace App\Http\Controllers;

use App\Models\AiSession;
use App\Models\AiMessage;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductDetail;
use App\Models\ShoppingCart;
use App\Models\CartItem;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AiMessageController extends Controller
{
    public function store(Request $request)
    {
        Log::info('--- Nueva petición a /api/chat (Gemini) ---');
        Log::info('Datos recibidos:', $request->all());

        try {
            $validated = $request->validate([
                'session_token' => 'sometimes|nullable|string',
                'message' => 'required|string|max:1000',
            ]);

            Log::info('Validación pasada.');

            $userId = $request->user()?->id;
            $receivedToken = $request->input('session_token');
            
            // Lógica de token mejorada
            $sessionToken = $receivedToken;
            if (!$sessionToken && !$userId) {
                $sessionToken = Str::uuid()->toString();
            } elseif ($userId && !$receivedToken) {
                $existingUserSession = AiSession::where('user_id', $userId)->latest('last_message_at')->first();
                $sessionToken = $existingUserSession?->session_token ?? Str::uuid()->toString();
            }

            Log::info('Token de sesión a usar:', ['token' => $sessionToken, 'recibido' => $receivedToken, 'userId' => $userId]);

            // 1. Encontrar o crear la sesión de IA
            // Si el token es "fantasma" (ej: "ABC"), creará una nueva sesión con "ABC".
            $session = AiSession::firstOrCreate(
                ['session_token' => $sessionToken],
                ['user_id' => $userId, 'last_message_at' => now()]
            );

            if ($userId && $session->user_id === null) {
                $session->user_id = $userId;
            }
            $session->last_message_at = now();
            $session->save();
            Log::info('Sesión encontrada/creada/actualizada:', ['session_id' => $session->id]);

            // --- INICIO: Lógica de Búsqueda de Productos ---
            $userMessageContent = $validated['message'];
            $keywords = $this->extractKeywords($userMessageContent);
            $isProductQuery = !empty($keywords);

            $userAiMessage = AiMessage::create([
                'session_id' => $session->id,
                'role' => 'user',
                'content' => $userMessageContent,
                'is_product_query' => $isProductQuery,
            ]);
            Log::info('Mensaje de usuario guardado:', ['message_id' => $userAiMessage->id, 'is_query' => $isProductQuery]);

            $productContext = "";
            $foundProducts = collect(); // Inicializar como colección vacía
            
            if ($isProductQuery) {
                Log::info('Palabras clave extraídas:', $keywords);
                $foundProducts = $this->searchProducts($keywords);
                if ($foundProducts->isNotEmpty()) {
                    $productContext = $this->formatProductContext($foundProducts);
                    Log::info('Contexto de producto generado:', ['context_length' => strlen($productContext)]);
                } else {
                    Log::info('No se encontraron productos para las palabras clave.');
                    $productContext = "No se encontraron productos que coincidan exactamente en OmniStyle con tu búsqueda, pero puedo ayudarte a encontrar algo similar.";
                }
            }
            // --- FIN: Lógica de Búsqueda de Productos ---

            // 3. Preparar historial para Gemini
            $history_messages = $session->messages()
                ->orderBy('created_at', 'desc')
                ->take(6)
                ->get()
                ->reverse();

            $history = $history_messages->map(function ($msg) {
                $role = ($msg->role === 'user') ? 'user' : 'model';
                return ['role' => $role, 'parts' => [['text' => $msg->content]]];
            })
                ->toArray();
            Log::info('Historial preparado para Gemini:', ['count' => count($history)]);

            // 5. Llamar a la API de Gemini
            $apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY'));
            if (!$apiKey) {
                throw new \Exception('Gemini API key not configured.');
            }

            $client = new Client(['timeout' => 60]);
            $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . $apiKey;

            $contents = [];
            $systemInstruction = "
Eres OmniStyle AI, el asistente de moda oficial de la tienda OmniStyle. REGLAS CRÍTICAS:

🎯 SOBRE PRODUCTOS:
- SOLO menciona productos que aparezcan en el contexto de catálogo que te proporciono
- NUNCA inventes productos, precios, colores o tallas que no estén en el contexto
- Si no hay productos en el contexto, di claramente que no tenemos ese tipo de producto disponible
- Siempre usa los nombres exactos, precios y detalles del contexto proporcionado

💬 ESTILO DE COMUNICACIÓN:
- Sé amable, profesional y conciso (máximo 3-4 oraciones por respuesta)
- Enfócate en ayudar al cliente a encontrar lo que busca
- Si encuentras productos relevantes, menciona: nombre, precio, y detalles clave
- Pregunta si quiere más información o ayuda con algo específico

❌ PROHIBIDO:
- Inventar productos que no existen en el catálogo
- Dar precios aproximados o inventados
- Mencionar productos de otras tiendas
- Respuestas muy largas o técnicas

✅ OBJETIVO: Ayudar al cliente basándote ÚNICAMENTE en nuestro catálogo real.
";

            $contents[] = ['role' => 'user', 'parts' => [['text' => $systemInstruction]]];
            $contents[] = ['role' => 'model', 'parts' => [['text' => 'Entendido. Soy OmniStyle AI. ¡Vamos a encontrar el estilo perfecto! Pregúntame lo que necesites sobre nuestro catálogo.']]];

            $last_user_message = array_pop($history);

            if (!empty($history)) {
                $contents = array_merge($contents, $history);
            }
            if (!empty($productContext)) {
                $contents[] = ['role' => 'user', 'parts' => [['text' => "Información relevante del catálogo de OmniStyle basada en la consulta más reciente: \n" . $productContext]]];
            }
            if ($last_user_message) {
                $contents[] = $last_user_message;
            }

            $payload = [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.6,
                    'maxOutputTokens' => 1024,
                ],
                'safetySettings' => [
                    ['category' => 'HARM_CATEGORY_HARASSMENT', 'threshold' => 'BLOCK_NONE'],
                    ['category' => 'HARM_CATEGORY_HATE_SPEECH', 'threshold' => 'BLOCK_NONE'],
                    ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_NONE'],
                    ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_NONE'],
                ]
            ];

            Log::info('Llamando a Gemini API con modelo gemini-flash-latest...');
            try {
                $response = $client->post($apiUrl, [
                    'json' => $payload,
                    'headers' => ['Content-Type' => 'application/json']
                ]);
                $body = json_decode($response->getBody()->getContents(), true);
                Log::info('Respuesta de Gemini recibida.');

                if (empty($body['candidates'])) {
                    $blockReason = $body['promptFeedback']['blockReason'] ?? 'Bloqueo desconocido (sin candidatos)';
                    Log::channel('stderr')->error('Respuesta de Gemini bloqueada (sin candidatos):', ['reason' => $blockReason, 'body' => $body]);
                    throw new \Exception('La respuesta fue bloqueada por filtros de seguridad: ' . $blockReason);
                }
                $candidate = $body['candidates'][0];
                if (isset($candidate['finishReason']) && $candidate['finishReason'] !== 'STOP') {
                    $reason = $candidate['finishReason'];
                    Log::channel('stderr')->error('Respuesta de Gemini incompleta:', ['reason' => $reason, 'body' => $body]);
                    throw new \Exception('La respuesta del asistente fue incompleta (' . $reason . ').');
                }
                if (!isset($candidate['content']['parts'][0]['text'])) {
                    Log::channel('stderr')->error('Respuesta inesperada de Gemini (sin parts/text):', $body);
                    throw new \Exception('Formato de respuesta de Gemini inesperado o bloqueado.');
                }

                $assistantMessage = $candidate['content']['parts'][0]['text'];

            } catch (RequestException $e) {
                $responseBody = $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : 'No response body';
                Log::channel('stderr')->error("Error llamando a Gemini API: " . $e->getMessage() . " - Status: " . ($e->hasResponse() ? $e->getResponse()->getStatusCode() : 'N/A') . " - Body: " . $responseBody);
                throw new \Exception('Error de conexión con Gemini.');
            }

            // 6. Guardar la respuesta del asistente
            $assistantAiMessage = AiMessage::create([
                'session_id' => $session->id,
                'role' => 'assistant',
                'content' => $assistantMessage,
            ]);
            Log::info('Respuesta de asistente guardada:', ['message_id' => $assistantAiMessage->id]);

            // 7. Preparar productos para el frontend (si encontró alguno)
            $productsForFrontend = [];
            if ($isProductQuery && !empty($foundProducts)) {
                $productsForFrontend = $foundProducts->map(function($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => $product->price,
                        'colors' => $product->details->pluck('color')->unique()->filter()->implode(', '),
                        'sizes' => $product->details->pluck('size')->unique()->filter()->sort()->implode(', '),
                        'image' => $product->image_url ?? null,
                        'short_description' => $product->short_description
                    ];
                })->toArray();
            }

            // 8. Devolver la respuesta al frontend
            return response()->json([
                'reply' => $assistantMessage,
                'session_token' => $session->session_token,
                'products' => $productsForFrontend
            ]);

        } catch (ValidationException $e) {
            Log::channel('stderr')->error("Error de Validación en Chat API: " . $e->getMessage(), $e->errors());
            return response()->json(['message' => 'Datos inválidos.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::channel('stderr')->error("Error General en Chat API (Gemini): " . $e->getMessage() . "\n" . $e->getTraceAsString());
            $errorMessage = 'No se pudo contactar al asistente en este momento.';
            if (str_contains($e->getMessage(), 'Gemini API key not configured')) {
                $errorMessage = 'La clave API de Gemini no está configurada.';
            } elseif (str_contains($e->getMessage(), 'bloqueada')) {
                $errorMessage = 'La respuesta del asistente fue bloqueada. Intenta reformular tu pregunta.';
            }
            return response()->json(['error' => $errorMessage], 500);
        }
    }

    // --- FUNCIONES AUXILIARES ---
    private function extractKeywords(string $message): array
    {
        $processedMessage = strtolower(preg_replace('/[¿?¡!,.]/', '', $message));
        $words = explode(' ', $processedMessage);
        
        // Solo extraer palabras clave de moda/productos específicas
        $fashionKeywords = [
            'vestido', 'vestidos', 'camisa', 'camisas', 'pantalon', 'pantalones', 'falda', 'faldas',
            'zapatos', 'zapatillas', 'botas', 'sandalia', 'sandalias', 'chaqueta', 'chaquetas',
            'abrigo', 'abrigos', 'jersey', 'jerseys', 'sudadera', 'sudaderas', 'camiseta', 'camisetas',
            'jeans', 'vaqueros', 'short', 'shorts', 'blazer', 'blazers', 'bufanda', 'bufandas',
            'gorro', 'gorros', 'gorra', 'gorras', 'sombrero', 'sombreros', 'bolso', 'bolsos', 'mochila', 'mochilas',
            'negro', 'blanco', 'rojo', 'azul', 'verde', 'amarillo', 'rosa', 'gris', 'marron',
            'xs', 's', 'm', 'l', 'xl', 'xxl', 'talla', 'color', 'casual', 'formal', 'deportivo',
            'hombre', 'mujer', 'unisex', 'invierno', 'verano', 'primavera', 'otoño', 'nike', 'adidas',
            'bota', 'calzado', 'ropa'
        ];
        
        // Filtrar solo palabras que están en nuestra lista de moda
        $keywords = array_filter($words, function($word) use ($fashionKeywords) {
            return in_array($word, $fashionKeywords);
        });
        
        $result = array_values(array_unique($keywords));
        
        Log::info('Palabras clave extraídas del mensaje:', [
            'mensaje' => $message,
            'palabras_originales' => $words,
            'keywords_filtradas' => $result
        ]);
        
        return $result;
    }

    private function searchProducts(array $keywords)
    {
        Log::info('Buscando productos con palabras clave:', $keywords);
        
        if (empty($keywords)) {
            return collect();
        }

        $query = Product::query()->with(['details', 'categories']);
        $query->where('is_active', true);

        // Filtrar solo palabras clave relevantes para productos
        $productKeywords = array_filter($keywords, function($keyword) {
            $fashionKeywords = [
                'vestido', 'vestidos', 'camisa', 'camisas', 'pantalon', 'pantalones', 'falda', 'faldas',
                'zapatos', 'zapatillas', 'botas', 'sandalia', 'sandalias', 'chaqueta', 'chaquetas',
                'abrigo', 'abrigos', 'jersey', 'jerseys', 'sudadera', 'sudaderas', 'camiseta', 'camisetas',
                'jeans', 'vaqueros', 'short', 'shorts', 'blazer', 'blazers', 'bufanda', 'bufandas',
                'gorro', 'gorros', 'gorra', 'gorras', 'sombrero', 'sombreros', 'bolso', 'bolsos', 'mochila', 'mochilas',
                'negro', 'blanco', 'rojo', 'azul', 'verde', 'amarillo', 'rosa', 'gris', 'marron',
                'xs', 's', 'm', 'l', 'xl', 'xxl', 'casual', 'formal', 'deportivo',
                'hombre', 'mujer', 'unisex', 'invierno', 'verano', 'primavera', 'otoño'
            ];
            return in_array(strtolower($keyword), $fashionKeywords);
        });

        Log::info('Palabras clave filtradas para búsqueda:', $productKeywords);

        if (empty($productKeywords)) {
            Log::info('No se encontraron palabras clave relevantes para productos');
            return collect();
        }

        // Construir la búsqueda con OR entre las diferentes palabras clave
        $query->where(function($q) use ($productKeywords) {
            $first = true;
            
            foreach ($productKeywords as $keyword) {
                $singular = rtrim($keyword, 's');
                $plural = $keyword . (substr($keyword, -1) !== 's' ? 's' : '');
                
                $searchMethod = $first ? 'where' : 'orWhere';
                $first = false;
                
                $q->{$searchMethod}(function ($subQ) use ($keyword, $singular, $plural) {
                    // Búsqueda en nombre del producto
                    $subQ->where('products.name', 'LIKE', "%{$keyword}%")
                         ->orWhere('products.name', 'LIKE', "%{$singular}%")
                         ->orWhere('products.name', 'LIKE', "%{$plural}%")
                         
                         // Búsqueda en descripciones
                         ->orWhere('products.short_description', 'LIKE', "%{$keyword}%")
                         ->orWhere('products.long_description', 'LIKE', "%{$keyword}%")
                         
                         // Búsqueda en categorías
                         ->orWhereHas('categories', function($cq) use ($keyword, $singular, $plural) {
                             $cq->where('name', 'LIKE', "%{$keyword}%")
                                ->orWhere('name', 'LIKE', "%{$singular}%")
                                ->orWhere('name', 'LIKE', "%{$plural}%");
                         })
                         
                         // Búsqueda en detalles (colores y tallas)
                         ->orWhereHas('details', function ($dq) use ($keyword, $singular, $plural) {
                             $dq->where('color', 'LIKE', "%{$keyword}%")
                                ->orWhere('color', 'LIKE', "%{$singular}%")
                                ->orWhere('color', 'LIKE', "%{$plural}%")
                                ->orWhere('size', 'LIKE', "%{$keyword}%");
                         });
                });
            }
        });
        
        $products = $query->distinct()->limit(5)->get();
        
        Log::info('Productos encontrados:', [
            'count' => $products->count(),
            'products' => $products->pluck('name')->toArray()
        ]);
        
        return $products;
    }

    private function formatProductContext($products): string
    {
        if ($products->isEmpty()) {
            return "No se encontraron productos que coincidan exactamente con la búsqueda en nuestro catálogo actual.";
        }
        
        $context = "=== PRODUCTOS DISPONIBLES EN OMNISTYLE ===\n";
        $context .= "Solo estos productos existen realmente en nuestra tienda:\n\n";
        
        foreach ($products as $product) {
            $context .= "🛍️ **{$product->name}**\n";
            $context .= "   💰 Precio: " . number_format($product->price, 2, ',', '.') . "€\n";
            $context .= "   📝 ID del producto: {$product->id}\n";
            
            if ($product->short_description) {
                $context .= "   📄 Descripción: {$product->short_description}\n";
            }
            
            if ($product->details->isNotEmpty()) {
                $colors = $product->details->pluck('color')->unique()->filter()->implode(', ');
                $sizes = $product->details->pluck('size')->unique()->filter()->sort()->implode(', ');
                
                if ($colors) {
                    $context .= "   🎨 Colores disponibles: {$colors}\n";
                }
                if ($sizes) {
                    $context .= "   📏 Tallas disponibles: {$sizes}\n";
                }
            }
            
            if ($product->categories->isNotEmpty()) {
                $categories = $product->categories->pluck('name')->implode(', ');
                $context .= "   🏷️ Categorías: {$categories}\n";
            }
            
            $context .= "\n";
        }
        
        $context .= "\n⚠️ IMPORTANTE: Solo menciona y recomienda estos productos específicos. No inventes otros productos que no aparezcan en esta lista.\n";
        $context .= "Si el usuario quiere añadir un producto al carrito, usa el ID del producto que aparece arriba.\n";
        
        return $context;
    }

    /**
     * Método para que la IA añada productos al carrito
     */
    public function addToCart(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'color' => 'sometimes|string',
                'size' => 'sometimes|string',
                'quantity' => 'sometimes|integer|min:1|max:10',
                'session_token' => 'sometimes|nullable|string'
            ]);

            $productId = $validated['product_id'];
            $color = $validated['color'] ?? null;
            $size = $validated['size'] ?? null;
            $quantity = $validated['quantity'] ?? 1;
            $sessionToken = $validated['session_token'] ?? null;
            $userId = $request->user()?->id;

            // Buscar el producto
            $product = Product::with('details')->findOrFail($productId);
            
            if (!$product->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este producto ya no está disponible.'
                ], 400);
            }

            // Si se especifica color y/o talla, verificar que existan
            if ($color || $size) {
                $detailQuery = $product->details();
                
                if ($color) {
                    $detailQuery->where('color', $color);
                }
                if ($size) {
                    $detailQuery->where('size', $size);
                }
                
                $detail = $detailQuery->first();
                
                if (!$detail) {
                    return response()->json([
                        'success' => false,
                        'message' => "La combinación de color '{$color}' y talla '{$size}' no está disponible para este producto."
                    ], 400);
                }
            }

            // Obtener o crear el carrito
            $cartQuery = ShoppingCart::query();
            
            if ($userId) {
                $cart = $cartQuery->where('user_id', $userId)->first();
            } elseif ($sessionToken) {
                $cart = $cartQuery->where('session_token', $sessionToken)->first();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Se requiere sesión para añadir productos al carrito.'
                ], 400);
            }

            if (!$cart) {
                $cart = ShoppingCart::create([
                    'user_id' => $userId,
                    'session_token' => $sessionToken,
                ]);
            }

            // Crear el ID único para el item del carrito
            $cartItemId = $productId . '-' . ($color ?? 'default') . '-' . ($size ?? 'default');

            // Verificar si ya existe este item en el carrito
            $existingItem = CartItem::where('shopping_cart_id', $cart->id)
                ->where('product_id', $productId)
                ->where('color', $color)
                ->where('size', $size)
                ->first();

            if ($existingItem) {
                // Actualizar cantidad
                $existingItem->quantity += $quantity;
                $existingItem->save();
                
                return response()->json([
                    'success' => true,
                    'message' => "Se ha actualizado la cantidad de '{$product->name}' en tu carrito.",
                    'cart_item' => [
                        'id' => $cartItemId,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'price' => $product->price,
                        'color' => $color,
                        'size' => $size,
                        'quantity' => $existingItem->quantity,
                        'total' => $product->price * $existingItem->quantity
                    ]
                ]);
            } else {
                // Crear nuevo item
                $cartItem = CartItem::create([
                    'shopping_cart_id' => $cart->id,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'color' => $color,
                    'size' => $size,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => "'{$product->name}' ha sido añadido a tu carrito.",
                    'cart_item' => [
                        'id' => $cartItemId,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'price' => $product->price,
                        'color' => $color,
                        'size' => $size,
                        'quantity' => $quantity,
                        'total' => $product->price * $quantity
                    ]
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Error al añadir producto al carrito desde IA:', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Hubo un error al añadir el producto al carrito. Inténtalo de nuevo.'
            ], 500);
        }
    }
}

