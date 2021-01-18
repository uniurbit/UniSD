<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Gestionale extends Model
{
    protected $table = 'gestionale';

    protected $fillable = [
        'descr_1',
        'descr_2',
        'descr_3'
    ];
}
