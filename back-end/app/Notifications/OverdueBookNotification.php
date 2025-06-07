<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OverdueBookNotification extends Notification implements ShouldQueue
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
        $daysOverdue = now()->diffInDays($this->reservation->due_date);
        
        return (new MailMessage)
                    ->subject('Overdue Book Notice')
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('You have an overdue book that needs to be returned.')
                    ->line('Book: ' . $this->reservation->book->title)
                    ->line('Author: ' . $this->reservation->book->author->name)
                    ->line('Due Date: ' . $this->reservation->due_date->format('Y-m-d'))
                    ->line('Days Overdue: ' . $daysOverdue)
                    ->line('Please return the book as soon as possible to avoid additional late fees.')
                    ->action('Contact Library', url('/contact'))
                    ->line('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'book_overdue',
            'reservation_id' => $this->reservation->id,
            'book_title' => $this->reservation->book->title,
            'due_date' => $this->reservation->due_date,
            'days_overdue' => now()->diffInDays($this->reservation->due_date),
            'message' => 'You have an overdue book that needs to be returned.',
        ];
    }
}
