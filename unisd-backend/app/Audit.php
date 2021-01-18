<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $table = 'audit';

    protected $fillable = [
        'field_name',
        'old_value',
        'new_value',
    ];


    //segnare i campi che si vuole tracciare
    public static $toTrace = [
    ];

    protected $casts = [
        'created_at' => 'datetime:d-m-Y',        
    ];
    
}
