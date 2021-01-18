<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ricerca extends Model
{
    protected $table = 'ricerca';

    protected $fillable = [
        'descr_1',
        'descr_2',
        'descr_3'
    ];
}
