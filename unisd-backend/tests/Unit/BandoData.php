<?php
namespace Tests\Unit;
use Storage;
use Auth;

class BandoData 
{

    public static function getArrayDocente(){
        return [            
            'name' => "Nome Cognome",
            'nome'=>"Nome",
            'cognome'=>"Cognome",
            'cf'=>"NLGMCR81M26H214M",
            'email'=>"nome.cognome@uniurb.it",
            'v_ie_ru_personale_id_ab'=>"26686",
            'password'=>null
        ];        
    }

    public static function getBando(){
        return [
            'descrizione'  => "Bando test",
            'data_inizio' => "26-08-2019",
            'data_fine' => "28-04-2021",
            'periodo_inizio' => '2016',
            'periodo_fine' => '2018',
            'stato' => 'abilitato',
            'template_codice'=>'SDART6',
            'sessione'=>'prima',
            'candidati' => "
            enrico.oliva@uniurb.it
            enrico.oliva1@uniurb.it
            enrico.oliva2@uniurb.it
            enrico.oliva3@uniurb.it
            enrico.oliva4@uniurb.it
            enrico.oliva5@uniurb.it
            enrico.oliva6@uniurb.it
            enrico.oliva7@uniurb.it
            enrico.oliva8@uniurb.it",
            'commissione' => "
            enrico.oliva@uniurb.it
            enrico.oliva1@uniurb.it
            enrico.oliva2@uniurb.it
            enrico.oliva3@uniurb.it
            enrico.oliva4@uniurb.it
            enrico.oliva5@uniurb.it
            enrico.oliva6@uniurb.it
            enrico.oliva7@uniurb.it
            enrico.oliva8@uniurb.it"
        ];
    }

    public static function getDomanda($bando_id){
        return [
            'bando_id'  => $bando_id,
            'ruolo' => 'PA',
            'contenuto'=> [
                'flag_didattica' => 1,
                'flag_ricerca' => 0,
                'flag_gestionale' => 0,
                'flag_aspettativa'=> 0,
                'flag_sanzioni'=> 0,
                'didattica' => [
                    'descr_1' => 'dato descr 1',
                    'descr_2' => 'dato descr 2',
                    'descr_3' => 'dato descr 3',
                ],
            ],
            'data_inoltro' => null,
        ];
    }

    public static function getInfoEmail(){
        return [
            'gruppo' => 'COMMISSIONE', //'CANDIDATI', 
            'oggetto' => 'prova 1', 
            'corpo_testo' => 'Avviso comunicazione',
            'allegato' => false
        ];
    }
}