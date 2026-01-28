<?php

namespace App\Mail;

use App\Models\RepairOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RepairStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $repairOrder;
    public $statusName;
    
    public function __construct()
    {
        $this->repairOrder = $repairOrder;
        $this->statusName = $statusName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'อัปเดตสถานะการซ่อม: ' . $this->repairOrder->repair_code,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.repair_status',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
