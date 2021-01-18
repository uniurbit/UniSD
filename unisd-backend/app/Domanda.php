<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Domanda extends Model
{
    protected $table = 'domande';

    protected $fillable = [
        'ruolo',
        'user_id',
        'bando_id',
   
        'flag_reinoltro',
        'data_inoltro',
        'num_prot',
        'stato'
    ];

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('total', function ($builder) {
            $builder 
            ->join('users as u', 'domande.user_id', '=', 'u.id')
            ->select([
                'u.nome',
                'u.cognome',
                'domande.*'
            ]);
        });
    }


    protected $appends = ['current_state','data_data_inoltro','ora_inoltro'];

    protected $casts = [
        'created_at' => 'datetime:d-m-Y',    
    ];

    public function bando()
    {
        return $this->belongsTo(Bando::class, 'bando_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'model')->AttachmentType();
    }

    public function getDataInoltroAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    public function getDataDataInoltroAttribute()
    {
        if (isset($this->attributes['data_inoltro']) && $this->attributes['data_inoltro']!= null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['data_inoltro'])->setTimezone(config('unidem.timezone'))->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }

    public function getOraInoltroAttribute()
    {
        if (isset($this->attributes['data_inoltro']) && $this->attributes['data_inoltro']!= null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['data_inoltro'])->setTimezone(config('unidem.timezone'))->format('H:i');
        }else{
            return null;
        }
    }

    private $_content=null;
    //contenuto convertito da json
    public function getContAttribute(){
        if ($this->_content == null){
            $this->_content = json_decode($this->attributes['contenuto']);
        }
        return $this->_content;
    }

    public function getCurrentStateAttribute(){
        if ($this->stato===null){
            return 'non_compilata';
        }

        if ($this->stato==0){
            return "bozza";
        }
        
        if ($this->stato==1){
            if($this->flag_ultima){
                return 'inoltrata_ultima';
            }else{
                return "inoltrata";
            }
        }
        return '';
    }



    public function isBlocked(){
        //abilitato, disabilitato
        //bando deve essere abilitato
        return $this->bando->isBlocked();
    }


    public function userTitle(){
        if($this->user->sesso == 'M') {
            return 'Il sottoscritto';
        } else if ($this->user->sesso == 'F'){
            return 'La sottoscritta';
        }else{
            return 'Il sottoscritto';
        }
    }

    public function ruoloTitle(){
        if ($this->ruolo == 'PO') {
           return'Professore di I fascia';
        } else if ($this->ruolo == 'PA') {
            return 'Professore di II fascia';
        } else if ($this->ruolo == 'RU') {
           return 'Ricercatore universitario';
        } else if ($this->ruolo == 'ND') {
          return 'Tecnico amministrativo';
        }else{
           return $this->ruolo;
        }
    }

    public function peridoString(){
        $num = $this->bando->numPeriodo();
        if ($num==0){
            $txt = "anno";
        } else if ($num==1){
            $txt = "biennio";
        } else if ($num==2){
            //esempio: nel triennio 2016/2018
            $txt = "triennio";
        }else{
            $txt = "periodo";
        }
        return $txt;
    }

    //l'anno; il biennio; il triennio
    public function numPeriodoArticoloTitle(){
        $num = $this->bando->numPeriodo();
        if ($num==0){
            $txt = "l'";
        } else {
            $txt = "il ";
        } 
        return $txt.$this->peridoString();
    }

    //nell'anno; nel biennio; nel triennio
    public function numPeriodoTitle(){
        $num = $this->bando->numPeriodo();
        if ($num==0){
            $txt = "nell'";
        } else {
            $txt = "nel ";
        } 
        return $txt.$this->peridoString();
    }

    public function periodoTitle($txtConc=null){ 
        $txt = $this->numPeriodoTitle();
        if ($txtConc==null)
            return $txt.' '.$this->bando->periodo_inizio.'/'.$this->bando->periodo_fine;
        else
            return $txt.' '.$txtConc.' '.$this->bando->periodo_inizio.'/'.$this->bando->periodo_fine;
    }


    public function annoAcc($num){
        //if ($this->bando->sessione=="prima"){
            //numero di anni progressivo
            return ($this->bando->periodo_inizio -1 +($num-1))."/".($this->bando->periodo_inizio + ($num-1));
        //}
        //return ($this->bando->periodo_inizio -1 +($num-1))."/".($this->bando->periodo_inizio + 1+ ($num-1));
    }

    public function annoSolare($num){
        //numero di anni progressivo
        return $this->bando->periodo_inizio + $num -1;
    }

    public function numAnni(){
        return $this->bando->periodo_fine - $this->bando->periodo_inizio;
    }
}
