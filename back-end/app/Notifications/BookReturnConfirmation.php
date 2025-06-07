<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookReturnConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @var Reservation
     */
    protected $reservation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Book Return Confirmation')
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('Your book return has been confirmed.')
                    ->line('Book: ' . $this->reservation->book->title)
                    ->line('Author: ' . $this->reservation->book->author->name)
                    ->line('Returned on: ' . $this->reservation->returned_at->format('Y-m-d H:i:s'))
                    ->line('Thank you for returning the book on time!')
                    ->line('Thank you for using our library!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'book_returned',
            'reservation_id' => $this->reservation->id,
            'book_title' => $this->reservation->book->title,
            'returned_at' => $this->reservation->returned_at,
            'message' => 'Your book return has been confirmed.',
        ];
    }
}
