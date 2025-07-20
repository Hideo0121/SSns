<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class BroadcastMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $body;
    public $recipientName;
    public $attachmentFiles;

    /**
     * Create a new message instance.
     */
    public function __construct($subject, $body, $recipientName = '', $attachments = [])
    {
        $this->subject = $subject;
        $this->body = $body;
        $this->recipientName = $recipientName;
        $this->attachmentFiles = $attachments;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.broadcast',
            with: [
                'body' => $this->body,
                'recipientName' => $this->recipientName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];
        
        foreach ($this->attachmentFiles as $file) {
            $attachments[] = Attachment::fromPath($file->getRealPath())
                                      ->as($file->getClientOriginalName())
                                      ->withMime($file->getMimeType());
        }
        
        return $attachments;
    }
}
