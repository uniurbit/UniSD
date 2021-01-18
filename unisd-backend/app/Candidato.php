<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class Candidato extends Model
{
    protected $table = 'candidati';

    protected $fillable = [
        'email',
    ];
  

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


   
//     select `domande`.*, `users`.`email` from 
// `domande` inner join `users` on `users`.`email` = `domande`.`user_id` where `users`.`email` in ('enrico.oliva@uniurb.it') 
    public function domande(){
        return $this->hasMany(Domanda::withoutGlobalScopes()->class, 'bando_id', 'id')->where('user_id',$this->id);
    }       


   
 
}
