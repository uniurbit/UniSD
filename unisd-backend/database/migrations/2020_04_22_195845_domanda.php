<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Domanda extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('domande', function (Blueprint $table) {
            $table->increments('id');                            
            
            $table->string('ruolo',2); //PO PA RU

            $table->dateTime('data_inoltro')->nullable();
            $table->boolean('flag_reinoltro')->default(0);
            $table->boolean('flag_ultima')->default(0);
            $table->unsignedInteger('stato')->default(0); //1 inviato 

            //da Titulus numero di protocollo
            $table->string('num_prot')->nullable(); 

            $table->unsignedInteger('bando_id');
            $table->unsignedInteger('user_id');

            $table->json('contenuto')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('bando_id')
                ->references('id')
                ->on('bandi');
                
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
        });

        Schema::create('comunicazioni', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->morphs('model');

            //receiver 
            $table->string('to')->nullable();   //singola email 
            $table->string('gruppo')->nullable();  //codice gruppo CANDIDATI, COMMISSIONE, CANDIDATI_COMMISSIONE
                   
            //codifica
            $table->string('codifica')->nullable(); //tipo email        
            //oggetto
            $table->string('oggetto')->nullable();     
            //corpo_testo        
            $table->text('corpo_testo')->nullable();   
              
            //$table->unsignedInteger('bando_id');
            $table->unsignedInteger('user_id');
            
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
           
        });

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
