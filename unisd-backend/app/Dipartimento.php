<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\FindParameter;
use App\Personale;
use App\UnitaOrganizzativa;
use App\Ruolo;
use App\Organico;

class Dipartimento extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $connection = 'oracle';    

    public $table = 'V_IE_AC_DIPARTIMENTI';
    public $primaryKey = 'CD_DIP';

      /**
     * Scope a query to only include active dipartments.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDipartimenti($query)
    {
        return $query->where('DT_FINE_VAL', '>=',  Carbon::now())->select('cd_dip','nome_breve','dip_id','cd_miur','id_ab');
    }

    //restituisce tutto il personale afferente ad un dipartimento
    public function personale()
    {
        return $this->hasManyThrough(Personale::class, UnitaOrganizzativa::class, 'id_ab', 'aff_org','dip_id','uo');
    }

    //restituisce tutto il personale diverso da pta?   
    public function docenti()
    {
        return $this->personale()->whereHas('ruolo', function($ruolo){
            $ruolo->whereIn('tipo_ruolo', Ruolo::DOCENTITYPE);
        });        
    }

    public function organico()
    {
        return $this->hasMany(Organico::class, 'id_ab_uo', 'id_ab');
    }

    public function direttoreDipartimento()
    {
        //return $this->incarichi()->where('V_IE_RU_INC_FUNZIONI.funzione','DFUN08')->get();        
        return $this->organico()->valido()->respArea();        
    }

    // 4499	4499	1	15230	    00448830414	Dipartimento di Giurisprudenza
    // 4504	4504	8	15232	    00448830414	Dipartimento di Economia, Società, Politica (DESP)
    // 26124	26124	22	19604	00448830414	DISCUI
    // 27605	27605	23	19602	00448830414	Dipartimento di Scienze Biomolecolari (DISB)
    // 26080	26080	20	19603	00448830414	Dipartimento di Scienze Pure e Applicate (DiSPeA)
    // 26121	26121	21	19605	00448830414	Dipartimento di Studi Umanistici (DISTUM) 

}
