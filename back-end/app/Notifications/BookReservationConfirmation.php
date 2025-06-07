<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookReservationConfirmation extends Notification implements ShouldQueue
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
                    ->subject('Book Reservation Confirmation')
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('Your book reservation has been confirmed.')
                    ->line('Book: ' . $this->reservation->book->title)
                    ->line('Author: ' . $this->reservation->book->author->name)
                    ->line('Due Date: ' . $this->reservation->due_date->format('Y-m-d'))
                    ->line('Please return the book by the due date to avoid late fees.')
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
            'type' => 'book_reserved',
            'reservation_id' => $this->reservation->id,
            'book_title' => $this->reservation->book->title,
            'due_date' => $this->reservation->due_date,
            'message' => 'Your book reservation has been confirmed.',
        ];
    }
}
