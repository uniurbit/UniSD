<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\AttachmentType;

class Dati extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $ctr = AttachmentType::where('codice','DOMANDA_BOZZA')->first();
        $attachType = AttachmentType::where('codice','BANDO_ALLEGATO_PRIVATO')->first();
        if (!$attachType && $ctr != null){
            $attachType = new AttachmentType();            
            $attachType->timestamps = false;
            $attachType->codice = 'BANDO_ALLEGATO_PRIVATO';
            $attachType->gruppo = 'bando_privato';
            $attachType->descrizione = 'Allegato privato';
            $attachType->descrizione_compl = 'Allegato privato';
            $attachType->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
