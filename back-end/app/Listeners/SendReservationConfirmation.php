<?php

namespace App\Listeners;

use App\Events\BookReserved;
use App\Notifications\BookReservationConfirmation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendReservationConfirmation implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BookReserved $event): void
    {
        $event->reservation->user->notify(new BookReservationConfirmation($event->reservation));
    }
}
