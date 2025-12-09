<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource (GET /api/products).
     */
    public function index()
    {
        // Obtiene todos los productos activos y sus relaciones para el catálogo
        $products = Product::with(['details', 'categories', 'offers' => function($query) {
            $query->vigente(); // Carga solo ofertas vigentes
        }])->active()->get();

        return response()->json($products);
    }

    /**
     * Display the specified resource (GET /api/products/{id}).
     */
    public function show(Product $product)
    {
        // Devuelve el producto y todas sus relaciones para la página de detalle
        $product->load(['details', 'categories', 'offers' => function($query) {
            $query->vigente(); // Carga solo ofertas vigentes
        }]);
        
        return response()->json($product);
    }

    /**
     * Store a newly created product (POST /api/products).
     */
    public function store(Request $request)
    {
        // Validar los datos del producto
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'details' => 'required|array|min:1',
            'details.*.color' => 'required|string|max:255',
            'details.*.size' => 'required|string|max:255',
            'details.*.stock' => 'required|integer|min:0',
            'details.*.image_url' => 'required|url',
            'offer.enabled' => 'boolean',
            'offer.name' => 'nullable|required_if:offer.enabled,true|string|max:255',
            'offer.discount_percentage' => 'nullable|required_if:offer.enabled,true|numeric|min:0.01|max:100',
            'offer.start_date' => 'nullable|required_if:offer.enabled,true|date',
            'offer.end_date' => 'nullable|required_if:offer.enabled,true|date|after:offer.start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Crear el producto
            $product = Product::create([
                'name' => $request->name,
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'price' => $request->price,
                'is_active' => $request->is_active ?? true,
            ]);

            // Asociar categorías
            $product->categories()->attach($request->categories);

            // Crear detalles del producto (variantes)
            foreach ($request->details as $detail) {
                $product->details()->create([
                    'color' => $detail['color'],
                    'size' => $detail['size'],
                    'stock' => $detail['stock'],
                    'image_url' => $detail['image_url'],
                ]);
            }

            // Crear oferta si está habilitada
            if ($request->input('offer.enabled', false)) {
                Offer::create([
                    'name' => $request->input('offer.name'),
                    'product_id' => $product->id,
                    'product_detail_id' => null, // Oferta aplicada al producto completo
                    'discount_percentage' => $request->input('offer.discount_percentage'),
                    'start_date' => $request->input('offer.start_date'),
                    'end_date' => $request->input('offer.end_date'),
                    'active' => true,
                ]);
            }

            DB::commit();

            // Cargar las relaciones para devolver el producto completo
            $product->load(['details', 'categories', 'offers']);

            return response()->json([
                'message' => 'Producto creado exitosamente',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Error al crear el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update the specified product (PUT /api/products/{id}).
     */
    public function update(Request $request, Product $product)
    {
        // Validar los datos del producto
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'details' => 'required|array|min:1',
            'details.*.id' => 'nullable|exists:product_details,id',
            'details.*.color' => 'required|string|max:255',
            'details.*.size' => 'required|string|max:255',
            'details.*.stock' => 'required|integer|min:0',
            'details.*.image_url' => 'required|url',
            'offer.enabled' => 'boolean',
            'offer.id' => 'nullable|exists:offers,id',
            'offer.name' => 'nullable|required_if:offer.enabled,true|string|max:255',
            'offer.discount_percentage' => 'nullable|required_if:offer.enabled,true|numeric|min:0.01|max:100',
            'offer.start_date' => 'nullable|required_if:offer.enabled,true|date',
            'offer.end_date' => 'nullable|required_if:offer.enabled,true|date|after:offer.start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Actualizar el producto
            $product->update([
                'name' => $request->name,
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'price' => $request->price,
                'is_active' => $request->is_active ?? true,
            ]);

            // Sincronizar categorías (elimina las viejas y añade las nuevas)
            $product->categories()->sync($request->categories);

            // Gestionar detalles del producto
            $detailIds = [];
            foreach ($request->details as $detailData) {
                if (isset($detailData['id'])) {
                    // Actualizar detalle existente
                    $detail = $product->details()->find($detailData['id']);
                    if ($detail) {
                        $detail->update([
                            'color' => $detailData['color'],
                            'size' => $detailData['size'],
                            'stock' => $detailData['stock'],
                            'image_url' => $detailData['image_url'],
                        ]);
                        $detailIds[] = $detail->id;
                    }
                } else {
                    // Crear nuevo detalle
                    $newDetail = $product->details()->create([
                        'color' => $detailData['color'],
                        'size' => $detailData['size'],
                        'stock' => $detailData['stock'],
                        'image_url' => $detailData['image_url'],
                    ]);
                    $detailIds[] = $newDetail->id;
                }
            }

            // Eliminar detalles que ya no están en la lista
            $product->details()->whereNotIn('id', $detailIds)->delete();

            // Gestionar oferta
            if ($request->input('offer.enabled', false)) {
                $offerData = [
                    'name' => $request->input('offer.name'),
                    'product_id' => $product->id,
                    'product_detail_id' => null,
                    'discount_percentage' => $request->input('offer.discount_percentage'),
                    'start_date' => $request->input('offer.start_date'),
                    'end_date' => $request->input('offer.end_date'),
                    'active' => true,
                ];

                if ($request->input('offer.id')) {
                    // Actualizar oferta existente
                    $offer = Offer::find($request->input('offer.id'));
                    if ($offer && $offer->product_id == $product->id) {
                        $offer->update($offerData);
                    }
                } else {
                    // Crear nueva oferta
                    Offer::create($offerData);
                }
            } else {
                // Si la oferta está deshabilitada, eliminar la oferta existente
                if ($request->input('offer.id')) {
                    $offer = Offer::find($request->input('offer.id'));
                    if ($offer && $offer->product_id == $product->id) {
                        $offer->delete();
                    }
                }
            }

            DB::commit();

            // Cargar las relaciones para devolver el producto completo
            $product->load(['details', 'categories', 'offers']);

            return response()->json([
                'message' => 'Producto actualizado exitosamente',
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Error al actualizar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product (DELETE /api/admin/products/{id}).
     */
    public function destroy(Product $product)
    {
        try {
            DB::beginTransaction();

            $product->offers()->delete();

            $product->details()->delete();

            $product->categories()->detach();

            $product->delete();

            DB::commit();

            return response()->json([
                'message' => 'Producto eliminado exitosamente'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Error al eliminar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}