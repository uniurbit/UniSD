<?php

namespace App\Exports;

use App\Domanda;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Service\UtilService;

class DomandaExport implements FromCollection, WithMapping, WithHeadings
{

    use Exportable;

    public function __construct($request, $findparam)
    {
        $this->request = $request;
        $this->findparam = $findparam;
    }
      

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {               
        $collection = UtilService::alldata(new Domanda, $this->request, $this->findparam);        
        return $collection;
    }

      /**
    * @var Domanda $dmn
    */
    public function map($dmn): array
    {      
        return [
            $dmn->id,
            $dmn->user ? $dmn->user->nome : '',
            $dmn->user ? $dmn->user->cognome : '',
            $dmn->bando ? $dmn->bando->descrizione: '',
            $dmn->bando ? $dmn->bando->sessione: '',
            $dmn->bando ? $dmn->bando->data_inizio: '',
            $dmn->bando ? $dmn->bando->data_fine: '',

            $dmn->bando ? $dmn->bando->periodo_riferimento: '',
            $dmn->bando ? $dmn->bando->current_state: '',
        ];
    }


    public function headings(): array
    {
        return [
            '#',
            'Nome',
            'Cognome',
            'Titolo bando',
            'Sessione',
            'Data inizio',
            'Data fine',
            'Periodo',
            'Stato',
        ];
    }

}
