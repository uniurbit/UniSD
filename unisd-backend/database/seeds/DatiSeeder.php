<?php
use Illuminate\Database\Seeder;
use App\Convenzione;
use App\MappingRuolo;
use App\Role;
use App\Personale;
use Illuminate\Support\Facades\Hash;

//php artisan db:seed --class=DatiSeeder
//composer dump-autoload -o 

////php artisan migrate:fresh --seed
class DatiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {                       
        $this->attachmenttypes();                  
        $this->mappingtable();        
        $this->mappingruoli();       
        $this->templates(); 
    }


    public function templates(){
        DB::table('templates')->insert([   
            'codice' => 'SDART6', 
            'nome_template'=>'templates.sdart6.domanda6',  
            'descrizione'=> 'Scatti stipendiali triennali articolo 6'     
        ]);
        
        DB::table('templates')->insert([   
            'codice' => 'SDART1', 
            'nome_template'=>'templates.sdart1.domanda1',  
            'descrizione'=> 'Scatti stipendiali biennali articolo 1'     
        ]);
        
        DB::table('templates')->insert([   
            'codice' => 'SD', 
            'nome_template'=>'templates.sdjson.domanda',  
            'descrizione'=> 'Scatti trinnali e biennali'     
        ]);

        DB::table('templates')->insert([   
            'codice' => 'STD', 
            'nome_template'=>'templates.sdjson.domanda',  
            'descrizione'=> 'Scatti stipendiali triennali'     
        ]);

        DB::table('templates')->insert([   
            'codice' => 'UNATANT', 
            'nome_template'=>'templates.sdjson.domanda',  
            'descrizione'=> 'Incentivo uno a tantum'     
        ]);

        DB::table('templates')->insert([   
            'codice' => 'STDUNAT', 
            'nome_template'=>'templates.sdjson.domanda',  
            'descrizione'=> 'Incentivo uno a tantum e scatti triennali'     
        ]);
    }


    private function onlyFirstUpper($value){
        return ucwords(mb_strtolower($value, 'UTF-8'));
    }

    
    private function insertOffice(Array $offices, $rolename){
        $role = Role::where('name', $rolename)->first();
        foreach ($offices as $office) {
            $mp = new MappingRuolo();
            $mp->unitaorganizzativa_uo = $office;
            $uo = $mp->unitaorganizzativa()->get()->first();
            //se esiste l'unità organizzativa
            if ($uo){
                $mp->descrizione_uo = $uo->descr;
                $mp->role_id = $role->id;
                $mp->save();
            }
        }       
    }


    public function mappingruoli(){
    
       $this->insertOffice(config('unidem.unitaSuperAdmin'), 'super-admin');
       $this->insertOffice(config('unidem.unitaAdmin'), 'admin');
       $this->insertOffice(['005144'], 'op_uff_amm');                    
    }


    public function mappingtable(){
        
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005199',
            'descrizione_uo' => 'Plesso Scientifico (DiSPeA-DiSB)',                     
            'strutturainterna_cod_uff' => 'SI000083',
            'descrizione_uff' => 'Plesso Scientifico (DISPeA e DISB)',                     
        ]);

        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005361',
            'descrizione_uo' => 'Ufficio Ricerca e Relazioni Internazionali - Sett. Ric. e Terza miss.',                     
            'strutturainterna_cod_uff' => 'SI000048',
            'descrizione_uff' => 'Ufficio Ricerca e Relazioni Internazionali',                     
        ]);

        if (App::environment('local') || App::environment('preprod')) {
            DB::table('mappinguffici')->insert([                          
                'unitaorganizzativa_uo' => '005400',
                'descrizione_uo' => 'Attività Sistemistiche  e Software Gestionali e Documentali - S.S.I.A.',                     
                'strutturainterna_cod_uff' => 'Uf1_51',
                'descrizione_uff' => 'Ufficio Protocollo e Archivio',                     
            ]);
        }else{
            DB::table('mappinguffici')->insert([                          
                'unitaorganizzativa_uo' => '005400',
                'descrizione_uo' => 'Attività Sistemistiche  e Software Gestionali e Documentali - S.S.I.A.',                     
                'strutturainterna_cod_uff' => 'SI000099',
                'descrizione_uff' => 'Attività sistemistiche e software Gestionali e Documentali',                     
            ]);
        }

        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005479',
            'descrizione_uo' => 'Rete Dati e Voce, Servizi Telematici e Assistenza Informatica - S.S.I.A.',                     
            'strutturainterna_cod_uff' => 'SI000100',
            'descrizione_uff' => 'Rete Dati e Voce, Servizi Telematici e Assistenza Informatica',                     
        ]);

                //004939	Dipartimento di Studi Umanistici (DISTUM) Dipartimento di Studi Umanistici (DISTUM) SI000089 PI000073
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '004939',
                    'descrizione_uo' => 'Dipartimento di Studi Umanistici (DISTUM)',                     
                    'strutturainterna_cod_uff' => 'SI000089',
                    'descrizione_uff' => 'Dipartimento di Studi Umanistici (DISTUM)',                     
                ]);
        
                //004424	Dipartimento di Economia, Società, Politica (DESP) - Dipartimento di Economia, Società, Politica (DESP) SI000058 PI000073
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '004424',
                    'descrizione_uo' => 'Dipartimento di Economia, Società, Politica (DESP)',                     
                    'strutturainterna_cod_uff' => 'SI000058',
                    'descrizione_uff' => 'Dipartimento di Economia, Società, Politica (DESP)',                     
                ]);
        
                //004419	Dipartimento di Giurisprudenza - Dipartimento di Giurisprudenza SI000062 PI000056
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '004419',
                    'descrizione_uo' => 'Dipartimento di Giurisprudenza',                     
                    'strutturainterna_cod_uff' => 'SI000062',
                    'descrizione_uff' => 'Dipartimento di Giurisprudenza',                     
                ]);
        
                //004940	Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media (DISCUI) - Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media - DISCUI SI000087 PI000056
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '004940',
                    'descrizione_uo' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media (DISCUI)',                     
                    'strutturainterna_cod_uff' => 'SI000087',
                    'descrizione_uff' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media - DISCUI',                     
                ]);
            

                //005579	Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali (DISCUI) SI000087 PI000056
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '005579',
                    'descrizione_uo' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali (DISCUI)',                     
                    'strutturainterna_cod_uff' => 'SI000087',
                    'descrizione_uff' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media - DISCUI',                     
                ]);



                //005019	Dipartimento di Scienze Biomolecolari (DISB) - Dipartimento di Scienze Biomolecolari SI000060 PI000083
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '005019',
                    'descrizione_uo' => 'Dipartimento di Scienze Biomolecolari (DISB)',                     
                    'strutturainterna_cod_uff' => 'SI000060',
                    'descrizione_uff' => 'Dipartimento di Scienze Biomolecolari',                     
                ]);
        
               
                //004919	Dipartimento di Scienze Pure e Applicate (DiSPeA) - Dipartimento di Scienze Pure e Applicate - DISPeA SI000084 PI000083
                DB::table('mappinguffici')->insert([                          
                    'unitaorganizzativa_uo' => '004919',
                    'descrizione_uo' => 'Dipartimento di Scienze Pure e Applicate (DiSPeA)',                     
                    'strutturainterna_cod_uff' => 'SI000084',
                    'descrizione_uff' => 'Dipartimento di Scienze Pure e Applicate - DISPeA',                     
                ]);


    }  

    public function attachmenttypes(){
        DB::table('attachmenttypes')->insert([   
            'codice' => 'DOMANDA',        
            'gruppo' => 'bando',
            'descrizione' => 'Domanda',
            'descrizione_compl' => 'Domanda',         
           // 'parent_type' => Domanda::class,   
        ]);

        DB::table('attachmenttypes')->insert([   
            'codice' => 'DOMANDA_BOZZA',        
            'gruppo' => 'bando',
            'descrizione' => 'Domanda bozza',
            'descrizione_compl' => 'Domanda bozza',         
           // 'parent_type' => Domanda::class,   
        ]);

        DB::table('attachmenttypes')->insert([   
            'codice' => 'BANDO_ALLEGATO',        
            'gruppo' => 'bando',
            'descrizione' => 'Allegato',  
            'descrizione_compl' => 'Allegato',        
            //'parent_type' => Bando::class,    
        ]);

        DB::table('attachmenttypes')->insert([   
            'codice' => 'BANDO_ALLEGATO_PRIVATO',        
            'gruppo' => 'bando_privato',
            'descrizione' => 'Allegato privato',  
            'descrizione_compl' => 'Allegato privato',        
            //'parent_type' => Bando::class,    
        ]);

    }
}
