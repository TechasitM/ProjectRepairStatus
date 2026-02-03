<?php

namespace App\Mail;

use App\Models\RepairOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RepairStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $repairOrder;
    public $statusName;
    public $note;
    public $sent_datetime;

    public function __construct(RepairOrder $repairOrder, string $statusName, ?string $note = null)
    {
        $this->repairOrder = $repairOrder;
        $this->statusName = $statusName;
        $this->note = $note;
        $this->sent_datetime = Carbon::now();
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
