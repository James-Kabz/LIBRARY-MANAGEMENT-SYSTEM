<?php

namespace App\Listeners;

use App\Events\BookReturned;
use App\Notifications\BookReturnConfirmation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendReturnConfirmation implements ShouldQueue
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
    public function handle(BookReturned $event): void
    {
        $event->reservation->user->notify(new BookReturnConfirmation($event->reservation));
    }
}
