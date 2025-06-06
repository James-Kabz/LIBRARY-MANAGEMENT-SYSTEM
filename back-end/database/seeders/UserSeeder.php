<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@library.com',
                'password' => Hash::make('password'),
                'phone' => '+1234567890',
                'address' => '123 Admin St',
                'role' => 'admin',
            ],
            [
                'name' => 'John Librarian',
                'email' => 'librarian@library.com',
                'password' => Hash::make('password'),
                'phone' => '+1234567891',
                'address' => '456 Library Ave',
                'role' => 'librarian',
            ],
            [
                'name' => 'Jane Member',
                'email' => 'member@library.com',
                'password' => Hash::make('password'),
                'phone' => '+1234567892',
                'address' => '789 Member Rd',
                'role' => 'member',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);

            $user = User::create($userData);
            $user->assignRole($role);
        }
    }
}
