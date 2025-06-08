<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Book permissions
            'view books',
            'create books',
            'edit books',
            'delete books',

            // Author permissions
            'view authors',
            'create authors',
            'edit authors',
            'delete authors',

            // Category permissions
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            // Reservation permissions
            'view reservations',
            'create reservations',
            'edit reservations',

            // reports permissions
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $librarianRole = Role::create(['name' => 'librarian']);
        $memberRole = Role::create(['name' => 'member']);

        // Admin gets all permissions
        $adminRole->givePermissionTo(Permission::all());

        // Librarian gets most permissions except user management
        $librarianPermissions = Permission::whereNotIn('name', [
            'create users',
            'edit users',
            'delete users'
        ])->get();
        $librarianRole->givePermissionTo($librarianPermissions);

        // Member gets limited permissions
        $memberPermissions = [
            'view books',
            'view authors',
            'view categories',
            'view reservations',
            'create reservations',
            'edit reservations',
            'view reports',
        ];
        $memberRole->givePermissionTo($memberPermissions);
    }
}
