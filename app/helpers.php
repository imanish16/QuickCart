<?php

use App\Models\Cart; 


function getGrandTotal($userId)
{
    $total = Cart::join('products', 'carts.product_id', '=', 'products.id')
                 ->where('carts.user_id', $userId)
                 ->selectRaw('SUM(products.price * carts.quantity) as total')
                 ->first();

    return $total->total ?? 0;
}