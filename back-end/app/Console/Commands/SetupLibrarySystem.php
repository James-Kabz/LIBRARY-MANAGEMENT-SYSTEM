<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class SetupLibrarySystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'library:setup {--fresh : Drop all tables and recreate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup the library management system with migrations and seeders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up Library Management System...');

        if ($this->option('fresh')) {
            $this->warn('This will drop all existing tables and data!');
            if ($this->confirm('Are you sure you want to continue?')) {
                $this->info('Dropping all tables...');
                Artisan::call('migrate:fresh');
                $this->info(Artisan::output());
            } else {
                $this->info('Setup cancelled.');
                return;
            }
        } else {
            $this->info('Running migrations...');
            Artisan::call('migrate');
            $this->info(Artisan::output());
        }

        $this->info('Installing Passport...');
        Artisan::call('passport:install', ['--force' => true]);
        $this->info(Artisan::output());

        $this->info('Seeding database...');
        Artisan::call('db:seed');
        $this->info(Artisan::output());

        $this->info('Creating storage link...');
        Artisan::call('storage:link');
        $this->info(Artisan::output());

        $this->info('Clearing cache...');
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');

        $this->newLine();
        $this->info('✅ Library Management System setup completed successfully!');
        $this->newLine();
        
        $this->info('Demo accounts created:');
        $this->line('📧 admin@library.com (password: password) - Admin');
        $this->line('📧 librarian@library.com (password: password) - Librarian');
        $this->line('📧 member@library.com (password: password) - Member');
        
        $this->newLine();
        $this->info('Next steps:');
        $this->line('1. Start the queue worker: php artisan queue:work');
        $this->line('2. Start the development server: php artisan serve');
        $this->line('3. Access the API at: http://localhost:8000/api');
    }
}
