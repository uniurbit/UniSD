<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Http\Controllers\Api\V1\QueryBuilder;
use App\Dipartimento;
use App\Organico;
use App\Personale;
use App\Service\RoleService;

class UnitaOrganizzativa extends Model
{
    protected $connection = 'oracle';    

    //gestione e inserimento
    //public $unitaAdmin = ['005480', '005479', '005400', '005199','004919']; //SSIA 004210

    public $table = 'VISTA_ORG_ATTIVA';
    public $primaryKey = 'ID_AB';

    protected $dates = [        
        'data_fin'        
    ];

    protected $casts = [
        'data_fin' => 'datetime:d-m-Y',
    ];
    
     public function dipartimento()
     {
        //if ($this->tipo == 'DIP')
        return $this->belongsTo(Dipartimento::class,'id_ab','dip_id');        
     }

     public function isUnitaAdmin(){
        
        if (in_array($this->uo, config('unidem.unitaAdmin')))
            return true;

        return false;
     }

    public function scopeUfficiValidazione($query){
         return $query->whereIn('uo', config('unidem.ufficiPerValidazione'));
    }


      //return $this->hasMany('App\Comment', 'foreign_key', 'local_key');
     //restituisce tutto il personale afferente ad una unità organizzativa (foglia)
     public function organico()
     {
         return $this->hasMany(Organico::class, 'id_ab_uo',  'id_ab');         
     }

     //con email
     public function personale()
     {
         return $this->hasMany(Personale::class, 'aff_org',  'uo');         
     }

     
     //dal plesso ai dipartimenti
     //se l'unità organizzativa corrente è un plesso 
     public function isPlesso(){
        return $this->tipo == 'PLD';
     }

     public function isDipartimento(){
        return $this->tipo == 'DIP';
     }
     
    public function dipartimenti(){
        if ($this->isPlesso()){
            //Plesso Economico - Umanistico (DESP-DISTUM)
            if ($this->id_ab == 26618){
                return ['004424','004939'];
            }
            //Plesso Giuridico-Umanistico (DIGIUR-DISCUI)
            if ($this->id_ab == 26616){
                return ['004419','004940','005579'];
            }
            //Plesso Scientifico (DiSPeA-DiSB)
            if ($this->id_ab == 32718){
                return ['004919','005019'];
            }           
        }
    }

    public static function allDipartimenti(){
        return ['004424','004939','004419','004940','004919','005019'];
    }

}

//decodifica dei tipi ruolo
// 12	Ricercatori a tempo determinato
// 6	Borsisti
// 9	Docenti di ruolo di IIa fascia
// 10	Dottorandi
// 11	Altro personale docente
// 1	Docenti di ruolo di Ia fascia
// 2	Ricercatori
// 3	Personale tecnico amm.vo
// 4	Personale esterno ed autonomi
// 8	Altri
// 0	Non assegnato
// 5	Collaboratori
// 7	Assegnisti
// 14	Professori a tempo determinato
// 13	Dirigenti
// 15	Apprendisti
// 18	Supplenti Docenti
// 16	Lettori e Collaboratori Linguistici
// 17	Tirocinanti