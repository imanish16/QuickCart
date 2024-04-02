<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;



Route::get('/', function () {
    return redirect('login');
});
Route::any('/tokens/create', function (Request $request) {
    $token = auth()->user()->createToken('Personal Access Token')->plainTextToken;
            return response()->json(['token' => $token]);
});
Route::get('/dashboard', function (Request $request) {

    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/products', [ProductController::class,'index'])->name('products.list');
Route::get('/products-list', [ProductController::class,'list'])->name('products.dt');
Route::get('/products/{id}', [ProductController::class,'show'])->name('product.detail');

    Route::get('/cart', [CartController::class,'cart'])->name('products.cart');

    Route::get('/cart-list', [CartController::class,'list'])->name('list.cart');
    Route::post('/add-cart', [CartController::class,'addToCart'])->name('add.cart');
    Route::post('/update-cart', [CartController::class,'updateCart'])->name('update.cart');
    Route::post('/remove-cart', [CartController::class,'removeCart'])->name('cart.remove');


require __DIR__.'/auth.php';