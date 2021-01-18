<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Bando extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      

        Schema::create('templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('codice',10)->unique();

            $table->string('nome_template',50);
            $table->string('descrizione',255)->nullable();
       
            $table->json('form_schema')->nullable();
            $table->mediumText('form')->nullable();
            
            $table->softDeletes();
            $table->timestamps();
         
        });

        Schema::create('bandi', function (Blueprint $table) {
            $table->increments('id');                            
            $table->string('descrizione',255);
            $table->date('data_inizio');
            $table->date('data_fine');
            $table->time('ora_inizio')->nullable();
            $table->time('ora_fine')->nullable();
            
            $table->string('stato',15)->default('disabilitato'); //abilitato, disabilitato
        
            $table->integer('periodo_inizio')->unsigned()->nullable();
            $table->integer('periodo_fine')->unsigned()->nullable();
            $table->string('sessione', 30);

            $table->string('template_codice',10);

            $table->string('num_fascicolo')->nullable(); 

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('template_codice')
                ->references('codice')
                ->on('templates');
        });

        Schema::create('candidati', function (Blueprint $table) {                         
            $table->string('email',100);
            $table->unsignedInteger('bando_id');
            $table->timestamps();

            $table->primary(['email', 'bando_id']);

            $table->foreign('bando_id')
                ->references('id')
                ->on('bandi');
        });

        Schema::create('membri', function (Blueprint $table) {                         
            $table->string('email',100);
            $table->unsignedInteger('bando_id');
            $table->timestamps();

            $table->primary(['email', 'bando_id']);

            $table->foreign('bando_id')
                ->references('id')
                ->on('bandi');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cadidati');
        Schema::dropIfExists('membri');
        Schema::dropIfExists('bandi');
    }
}
