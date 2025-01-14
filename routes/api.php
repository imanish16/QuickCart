<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;


Route::post('/tokens/create', function (Request $request) {
    
    $token = $request->user()->createToken($request->token_name);
 
    return ['token' => $token->plainTextToken];
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


    Route::get('/products', [ProductController::class,'list'])->name('products.list');
    Route::get('/products/{id}', [ProductController::class,'show'])->name('product.detail');