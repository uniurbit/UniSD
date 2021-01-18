<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comunicazione extends Model
{
    protected $table = 'comunicazioni';

    protected $fillable = [
        'oggetto',
        'gruppo',
        'corpo_testo',
        'codifica'
    ];

        /**
     * Relationship: model
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function model()
    {
        return $this->morphTo();
    }

  
}
