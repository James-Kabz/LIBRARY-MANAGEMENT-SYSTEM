<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            [
                'name' => 'J.K. Rowling',
                'biography' => 'British author, best known for the Harry Potter series.',
                'birth_date' => '1965-07-31',
            ],
            [
                'name' => 'George Orwell',
                'biography' => 'English novelist and essayist, journalist and critic.',
                'birth_date' => '1903-06-25',
            ],
            [
                'name' => 'Jane Austen',
                'biography' => 'English novelist known primarily for her six major novels.',
                'birth_date' => '1775-12-16',
            ],
            [
                'name' => 'Stephen King',
                'biography' => 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.',
                'birth_date' => '1947-09-21',
            ],
            [
                'name' => 'Agatha Christie',
                'biography' => 'English writer known for her sixty-six detective novels and fourteen short story collections.',
                'birth_date' => '1890-09-15',
            ],
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
