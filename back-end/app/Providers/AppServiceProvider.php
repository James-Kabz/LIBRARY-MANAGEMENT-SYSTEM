<?php

namespace App\Providers;

use App\Events\BookReserved;
use App\Events\BookReturned;
use App\Events\ReservationOverdue;
use App\Jobs\CheckOverdueReservations;
use App\Notifications\BookReservationConfirmation;
use App\Notifications\BookReturnConfirmation;
use App\Notifications\OverdueBookNotification;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\Interfaces\BookRepositoryInterface;
use App\Repositories\BookRepository;
use App\Repositories\Interfaces\ReservationRepositoryInterface;
use App\Repositories\ReservationRepository;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\CategoryRepository;
use App\Repositories\Interfaces\AuthorRepositoryInterface;
use App\Repositories\AuthorRepository;
use function Illuminate\Events\queueable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repositories to their interfaces
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BookRepositoryInterface::class, BookRepository::class);
        $this->app->bind(ReservationRepositoryInterface::class, ReservationRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(AuthorRepositoryInterface::class, AuthorRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(queueable(function (ReservationOverdue $event) {
            $event->reservation->user->notify(new OverdueBookNotification($event->reservation));
        })->onConnection(env('QUEUE_CONNECTION')));

        Event::listen(queueable(function (BookReserved $event) {
            $event->reservation->user->notify(new BookReservationConfirmation($event->reservation));
        })->onConnection(env('QUEUE_CONNECTION')));

        Event::listen(queueable(function (BookReturned $event) {
            $event->reservation->user->notify(new BookReturnConfirmation($event->reservation));
        })->onConnection(env('QUEUE_CONNECTION')));
    }
}
