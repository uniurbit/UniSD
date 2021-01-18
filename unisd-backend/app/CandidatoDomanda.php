<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CandidatoDomanda extends Model
{
    protected $table = 'candidati';

    protected $fillable = [
        'email',
        'statodomanda',
        'data_inoltro'
    ];

    protected $casts = [     
    ];

    protected $appends = ['periodo_riferimento','nominativo','current_state','data_data_inoltro','ora_inoltro'];

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('total', function ($builder) {
            ($builder //->from('candidati as c')
             ->join('bandi as bando', 'candidati.bando_id','=','bando.id')
             ->leftJoin('users as u', 'candidati.email', '=', 'u.email')
             ->leftJoin('domande as d', function($join) {
                $join->on('d.user_id', '=', 'u.id')->on('d.bando_id','=','bando.id');
            }))
             ->orderBy('u.cognome')
             ->select([
                'u.name',
                'u.nome',
                'u.cognome',
                'candidati.*',
                'bando.id as bandoid',
                'bando.sessione',
                'bando.periodo_inizio',
                'bando.periodo_fine',
                'bando.descrizione',
                'd.id as domandaid',
                'd.flag_ultima',
                'd.stato as statodomanda',
                'd.data_inoltro',
                'd.num_prot'
             ]);
        });
    }


    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function bando()
    {
        return $this->belongsTo(Bando::class, 'bando_id', 'id');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
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


    public function getPeriodoRiferimentoAttribute(){
        return $this->periodo_inizio.'/'.$this->periodo_fine;
    }

    public function getNominativoAttribute(){
        if ($this->user)
            return $this->user->name;
        else
            return 'Non a sistema';
    }

    public function getCurrentStateAttribute(){
        if ($this->statodomanda===null){
            return 'non_compilata';
        }

        if ($this->statodomanda==0){
            return "bozza";
        }
        
        if ($this->statodomanda==1){
            if($this->attributes['flag_ultima']){
                return 'inoltrata_ultima';
            }else{
                return "inoltrata";
            }
        }
    }
    

}
