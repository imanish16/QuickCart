<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{

    public function cart(Request $request)
    {
            return view('products.cart');
    }

public function list(Request $request)
{
    $userId = auth()->id();
    $cartItems = Cart::where('user_id', $userId)->with('product')->get();
    
    $formattedCartItems = [];

    foreach ($cartItems as $item) {
        
        $productName = optional($item->product)->name; 
        $price = optional($item->product)->price;
        
        $formattedCartItems[] = [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'product_name' => $productName,
            'price' => ($price * $item->quantity),
            'quantity' => $item->quantity,
            'actions' => [
                    'drop' => route('cart.remove'), // Assuming a route for adding a product to cart
                    'id' => $item->id, // Assuming a route for adding a product to cart
                ],
        ];
    }

    return response()->json($formattedCartItems);
}

public function addToCart(Request $request)
{
   try {
        $rules = [
            'productId' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:1',
        ];

        $validatedData = $request->validate($rules);

        $userId = auth()->user()->id;
        $productId = $validatedData['productId'];
        $quantity = $validatedData['quantity'];

        // Check if the product already exists in the user's cart
        $existingCartItem = Cart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existingCartItem) {
            // If the product already exists, update the quantity
            $existingCartItem->quantity += $quantity;
            $existingCartItem->save();
        } else {
            // If the product doesn't exist, create a new cart item
            $cartItem = new Cart();
            $cartItem->user_id = $userId;
            $cartItem->product_id = $productId;
            $cartItem->quantity = $quantity;
            $cartItem->save();
        }

        return response()->json(['message' => 'Item added to cart successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error adding product to cart: ' . $e->getMessage()], 500);
    }
}
    public function removeCart(Request $request)
    {
        $id = $request->id;
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Cart item removed successfully']);
    }

}