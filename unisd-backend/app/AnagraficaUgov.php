<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AnagraficaUgov extends Model
{
    protected $connection = 'oracle';    
    protected $table = 'ANAGRAFICA';
    public $primaryKey = 'ID_AB';

    protected $casts = [
        'data_nasc' => 'datetime:d-m-Y',        
    ];

    // restituisce un persona cercandola dalla sua email
    public function scopeFindByEmail($query, $email)
    {        
        return $query->where('email',$email)->first();
    }
}
