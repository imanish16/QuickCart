<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
public function index(Request $request)
{
        return view('products.index');
}

    public function list(Request $request)
    {
        $products = Product::all();

        // Map the products array to the desired format
        $mappedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name ?? 'NA',
                'description' => $product->description ?? 'NA',
                'price' => $product->price ?? 'NA',
                'quantity' => $product->quantity ?? 'NA',
                'actions' => [
                    'buy' => route('products.list', $product->id), // Assuming a route for buying a product
                    'addToCart' => route('products.list', $product->id), // Assuming a route for adding a product to cart
                    'id' => $product->id, // Assuming a route for adding a product to cart
                ],
            ];
        });

        // Return the mapped products as JSON response
        return response()->json($mappedProducts);
    }
    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        return response()->json(['product' => $product]);
    }

}