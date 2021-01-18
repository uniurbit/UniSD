<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Domanda;
use Auth;


class DomandaEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $dmn;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Domanda $dmn, $document, $documentName)
    {
        $this->dmn = $dmn;
        $this->document = $document;
        $this->documentName = $documentName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {        
        return $this->subject("Domanda partecipazione") // al bando: ".strtolower($this->dmn->bando->descrizione)             
            ->markdown('emails.domandaemail')->with([
                'dmn' => $this->dmn,                 
            ])
            ->attachData($this->document, $this->documentName, [
                'mime' => 'application/pdf',
            ]);
        
    }
}
