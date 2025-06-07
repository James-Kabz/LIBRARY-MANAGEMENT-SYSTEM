<?php

namespace App\Listeners;

use App\Events\ReservationOverdue;
use App\Notifications\OverdueBookNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOverdueNotification implements ShouldQueue
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
    public function handle(ReservationOverdue $event): void
    {
        $event->reservation->user->notify(new OverdueBookNotification($event->reservation));
    }
}
