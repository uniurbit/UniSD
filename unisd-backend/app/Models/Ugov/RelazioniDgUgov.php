<?php

namespace App\Models\Ugov;

use Illuminate\Database\Eloquent\Model;

class RelazioniDgUgov extends Model
{
    protected $connection = 'oracle';    
    protected $table = 'V_IE_DG02_R_DG';
   

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::addGlobalScope('distinct1', function($builder) {
    //         $builder->select(['id_dg','id_dg_1','id_dg_2','dt_annullamento'])->distinct();
    //     });
    // }

    public function scopeDistinti($query){
        $query->select(['id_dg','id_dg_1','id_dg_2','dt_annullamento'])->distinct();
    }


    public function compenso()
    {
        return $this->belongsTo(CompensoUgov::class, 'ID_DG_2', 'ID_DG');
    }
}
