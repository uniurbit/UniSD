<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Bando;
use Auth;
use Storage;

class InfoEmail extends Mailable
{
    use Queueable, SerializesModels;


    protected $bando;
    protected $entity;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Bando $bando, $entity)
    {
        $this->bando = $bando;
        $this->entity = $entity;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {        
        $message =  $this->from(Auth::user())  
            ->cc(Auth::user())          
            ->subject($this->entity['oggetto'])     
            ->markdown('emails.infoemail')->with([
                'bando' => $this->bando,     
                'entity' => $this->entity,
                'urlUniSD' => url(config('unidem.client_url')), //.'/home'      
        ]);

        if ($this->entity['allegato']){
            foreach ($this->bando->attachments as $attach) { 
                $message->attachData(Storage::get($attach->filepath), $attach->description, [
                    'mime' => 'application/pdf',
                ]); 
            }
        }
      
    }
}
