<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        // Generate dummy data for products
        $products = [];
        for ($i = 0; $i < 10; $i++) {
            $products[] = [
                'name' => $faker->sentence(3),
                'description' => $faker->paragraph(2),
                'price' => $faker->randomFloat(2, 10, 1000), // Generate random price
                'quantity' => $faker->numberBetween(2, 10), // Generate random price
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert the dummy data into the 'products' table
        DB::table('products')->insert($products);
    }
}