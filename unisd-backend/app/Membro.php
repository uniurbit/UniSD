<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Membro extends Model
{
    protected $table = 'membri';

    protected $fillable = [
        'email',
    ];
}
