<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Attachment;
use App\Candidato;
use App\Membro;
use App\Template;
use Carbon\Carbon;

class Bando extends Model
{
    protected $table = 'bandi';

    protected $fillable = [
        'descrizione', //titolo e l'oggetto
        'data_inizio',
        'data_fine',
        'periodo_inizio',
        'periodo_fine',
        'sessione',
        'stato',
        'template_codice'
    ];

    protected $appends = ['periodo_riferimento','current_state'];

    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function candidati()
    {
        return $this->hasMany(Candidato::class, 'bando_id', 'id');
    }

    public function commissione()
    {
        return $this->hasMany(Membro::class, 'bando_id', 'id');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'model')->AttachmentType();
    }


    public function template()
    {
        return $this->belongsTo(Template::class, 'template_codice', 'codice');
    }

    public function comunicazioni()
    {
        return $this->morphMany(Comunicazione::class, 'model');
    }
    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataInizioAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }

  /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataInizioAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_inizio'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_inizio'] = null;
        }
    }


      /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataFineAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }

  /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataFineAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_fine'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_fine'] = null;
        }
    }

    public function getPeriodoRiferimentoAttribute(){
        return $this->periodo_inizio.'/'.$this->periodo_fine;
    }

    public function getCurrentStateAttribute(){
        $date = Carbon::now()->setTimezone(config('unidem.timezone'));
        if ($date->between(Carbon::createFromFormat('Y-m-d', $this->attributes['data_inizio'])->startOfDay(),
            Carbon::createFromFormat('Y-m-d',$this->attributes['data_fine'])->endOfDay(),true)){
            return 'Aperto';
        }
        return 'Chiuso';
    }

    public function isValidDate($date){

        if ($date->between(Carbon::createFromFormat('Y-m-d', $this->attributes['data_inizio'])->startOfDay(),
            Carbon::createFromFormat('Y-m-d',$this->attributes['data_fine'])->endOfDay(),true)){
            return true;
        }
        return false;
    }

    public function isCommissioneValidDate(){
        $date = Carbon::now()->setTimezone(config('unidem.timezone'));
        //maggiorne della data di chiusura
        if ($date->greaterThan(Carbon::createFromFormat('Y-m-d',$this->attributes['data_fine'])->endOfDay(),false)){
            return true;
        }
        return false;
    }

    public function isBlocked(){
        //abilitato, disabilitato
        //bando deve essere abilitato
        if ($this->stato == 'disabilitato'){
            return true;
        }

        //il bando deve avere una data valida oggi compresa tra data inizio e data fine
        $toDay = Carbon::now()->setTimezone(config('unidem.timezone'));
        if ($this->isValidDate($toDay)){
            return false;
        }
        
        return true;
    }


    public function numPeriodo(){
        return $this->periodo_fine - $this->periodo_inizio;
    }

    public function sessioneTitle(){
       return $this->sessione.' sessione';
    }

    public function annoAttivazione(){
        return (Carbon::createFromFormat('Y-m-d', $this->attributes['data_inizio']))->year;
    }
}
