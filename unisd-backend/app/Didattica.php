<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Didattica extends Model
{
    protected $table = 'didattica';

    protected $fillable = [
        'descr_1',
        'descr_2',
        'descr_3'
    ];
}
