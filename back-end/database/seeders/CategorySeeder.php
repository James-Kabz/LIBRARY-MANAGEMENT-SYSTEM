<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fiction',
                'description' => 'Literary works of imaginative narration',
            ],
            [
                'name' => 'Mystery',
                'description' => 'Stories involving puzzling crimes or unexplained events',
            ],
            [
                'name' => 'Fantasy',
                'description' => 'Stories set in imaginary worlds with magical elements',
            ],
            [
                'name' => 'Classic',
                'description' => 'Literature that has stood the test of time',
            ],
            [
                'name' => 'Horror',
                'description' => 'Stories intended to frighten, unsettle, or create suspense',
            ],
            [
                'name' => 'Romance',
                'description' => 'Stories focusing on love and romantic relationships',
            ],
            [
                'name' => 'Science Fiction',
                'description' => 'Stories dealing with futuristic concepts and advanced technology',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
