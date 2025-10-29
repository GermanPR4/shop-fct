<?php

namespace App\Http\Controllers;

use App\Models\AiSession;
use App\Models\AiMessage;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductDetail;
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
            // --- CORRECCIÓN AQUÍ ---
            // Hemos quitado la regla 'exists:ai_sessions,session_token'
            // La lógica firstOrCreate manejará si existe o no, evitando el error 422.
            $validated = $request->validate([
                'session_token' => 'sometimes|nullable|string',
                'message' => 'required|string|max:1000',
            ]);
            // --- FIN CORRECCIÓN ---

            Log::info('Validación pasada.');

            $userId = $request->user()?->id;
            $receivedToken = $request->input('session_token');
            // Lógica de token mejorada
            $sessionToken = $receivedToken;
            if (!$sessionToken && !$userId) { // Invitado nuevo
                $sessionToken = Str::uuid()->toString();
            } elseif ($userId && !$receivedToken) { // Usuario logueado sin token
                $existingUserSession = AiSession::where('user_id', $userId)->latest('last_message_at')->first();
                $sessionToken = $existingUserSession?->session_token ?? Str::uuid()->toString(); // Usar existente o crear nuevo
            }

            // Si $receivedToken existe pero no está en la BD (porque hicimos migrate:fresh),
            // firstOrCreate creará uno nuevo con ese token.
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
            $systemInstruction = "Eres OmniStyle AI, un asistente de moda experto y amable de la tienda OmniStyle. Tu objetivo principal es ayudar al usuario a encontrar prendas en nuestro catálogo. Usa el historial de conversación y el contexto de productos proporcionado para dar recomendaciones relevantes y específicas de OmniStyle. Si encuentras productos adecuados basados en la consulta y el contexto, menciónalos brevemente (Nombre, Colores/Tallas disponibles si aplican, Precio) y pregunta directamente al usuario si quiere añadir alguno al carrito. Si no encuentras productos exactos en el contexto, informa al usuario amablemente y sugiere alternativas generales basadas en su consulta. Sé siempre conciso, amigable y enfocado en la venta.";

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

            // 7. Devolver la respuesta al frontend
            return response()->json([
                'reply' => $assistantMessage,
                'session_token' => $session->session_token
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
        $stopWords = ['un', 'una', 'unos', 'unas', 'el', 'la', 'los', 'las', 'de', 'del', 'a', 'ante', 'bajo', 'con', 'contra', 'desde', 'en', 'entre', 'hacia', 'hasta', 'para', 'por', 'según', 'sin', 'sobre', 'tras', 'quiero', 'busco', 'necesito', 'algo', 'ropa', 'prenda', 'dame', 'ver', 'mostrar', 'tienes', 'hay', 'puedes', 'ayudarme'];
        $keywords = array_filter($words, fn($word) => !in_array($word, $stopWords) && strlen($word) > 2);
        return array_values(array_unique($keywords));
    }

    private function searchProducts(array $keywords)
    {
        $query = Product::query()->with(['details', 'categories']);
        $query->where('is_active', true);

        if (empty($keywords)) {
            return collect();
        }

        foreach ($keywords as $keyword) {
            $singular = rtrim($keyword, 's');
            $plural = $keyword . 's';

            $query->where(function ($q) use ($keyword, $singular, $plural) {
                $q->where('products.name', 'LIKE', "%{$keyword}%")
                    ->orWhere('products.name', 'LIKE', "%{$singular}%")
                    ->orWhere('products.name', 'LIKE', "%{$plural}%")
                    ->orWhere('products.short_description', 'LIKE', "%{$keyword}%")
                    ->orWhere('products.long_description', 'LIKE', "%{$keyword}%")
                    ->orWhereHas(
                        'categories',
                        fn($cq) => $cq->where('name', 'LIKE', "%{$keyword}%")
                            ->orWhere('name', 'LIKE', "%{$singular}%")
                            ->orWhere('name', 'LIKE', "%{$plural}%")
                    )
                    ->orWhereHas('details', function ($dq) use ($keyword) {
                        if (!is_numeric($keyword)) {
                            $dq->where('color', 'LIKE', "%{$keyword}%")
                                ->orWhere('size', 'LIKE', "%{$keyword}%");
                        } else {
                            $dq->where('size', 'LIKE', "%{$keyword}%")
                                ->orWhere('color', 'LIKE', "%{$keyword}%");
                        }
                    });
            });
        }
        return $query->take(3)->get();
    }

    private function formatProductContext($products): string
    {
        $context = "";
        foreach ($products as $product) {
            $context .= "Producto: " . $product->name . "\n";
            $context .= "  Precio: " . number_format($product->price, 2, ',', '.') . "€\n";
            if ($product->details->isNotEmpty()) {
                $colors = $product->details->pluck('color')->unique()->implode(', ');
                $sizes = $product->details->pluck('size')->unique()->sort()->implode(', ');
                $context .= "  Colores: " . $colors . "\n";
                $context .= "  Tallas: " . $sizes . "\n";
            }
            $context .= "---\n";
        }
        return Str::limit(trim($context), 2000);
    }
}

