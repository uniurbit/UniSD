<?php

namespace App\Uniurbdb;

use Illuminate\Database\Eloquent\Model;
use App\Attachment;
use App\Candidato;
use App\Membro;
use App\Template;
use Carbon\Carbon;

class Persona extends Model
{
    protected $connection = 'finder';  

    protected $table = 'persone';
}