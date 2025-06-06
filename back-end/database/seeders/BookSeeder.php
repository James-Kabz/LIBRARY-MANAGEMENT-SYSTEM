<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'title' => 'Harry Potter and the Philosopher\'s Stone',
                'isbn' => '9780747532699',
                'published_year' => 1997,
                'description' => 'The first book in the Harry Potter series.',
                'total_copies' => 5,
                'available_copies' => 5,
                'author_name' => 'J.K. Rowling',
                'categories' => ['Fantasy', 'Fiction'],
            ],
            [
                'title' => 'Harry Potter and the Chamber of Secrets',
                'isbn' => '9780747538493',
                'published_year' => 1998,
                'description' => 'The second book in the Harry Potter series.',
                'total_copies' => 3,
                'available_copies' => 3,
                'author_name' => 'J.K. Rowling',
                'categories' => ['Fantasy', 'Fiction'],
            ],
            [
                'title' => '1984',
                'isbn' => '9780451524935',
                'published_year' => 1949,
                'description' => 'A dystopian social science fiction novel.',
                'total_copies' => 4,
                'available_copies' => 4,
                'author_name' => 'George Orwell',
                'categories' => ['Fiction', 'Science Fiction', 'Classic'],
            ],
            [
                'title' => 'Animal Farm',
                'isbn' => '9780451526342',
                'published_year' => 1945,
                'description' => 'An allegorical novella about farm animals.',
                'total_copies' => 3,
                'available_copies' => 3,
                'author_name' => 'George Orwell',
                'categories' => ['Fiction', 'Classic'],
            ],
            [
                'title' => 'Pride and Prejudice',
                'isbn' => '9780141439518',
                'published_year' => 1813,
                'description' => 'A romantic novel of manners.',
                'total_copies' => 2,
                'available_copies' => 2,
                'author_name' => 'Jane Austen',
                'categories' => ['Fiction', 'Romance', 'Classic'],
            ],
            [
                'title' => 'The Shining',
                'isbn' => '9780307743657',
                'published_year' => 1977,
                'description' => 'A horror novel about a haunted hotel.',
                'total_copies' => 2,
                'available_copies' => 2,
                'author_name' => 'Stephen King',
                'categories' => ['Horror', 'Fiction'],
            ],
            [
                'title' => 'Murder on the Orient Express',
                'isbn' => '9780062693662',
                'published_year' => 1934,
                'description' => 'A detective novel featuring Hercule Poirot.',
                'total_copies' => 3,
                'available_copies' => 3,
                'author_name' => 'Agatha Christie',
                'categories' => ['Mystery', 'Fiction', 'Classic'],
            ],
        ];

        foreach ($books as $bookData) {
            $author = Author::where('name', $bookData['author_name'])->first();
            $categoryNames = $bookData['categories'];
            
            unset($bookData['author_name'], $bookData['categories']);
            $bookData['author_id'] = $author->id;

            $book = Book::create($bookData);

            // Attach categories
            $categories = Category::whereIn('name', $categoryNames)->get();
            $book->categories()->attach($categories);
        }
    }
}
