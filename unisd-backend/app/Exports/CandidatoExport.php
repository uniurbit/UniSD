<?php

namespace App\Exports;

use App\CandidatoDomanda;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Service\UtilService;

class CandidatoExport implements FromCollection, WithMapping, WithHeadings
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
        $collection = UtilService::alldata(new CandidatoDomanda, $this->request, $this->findparam);        
        return $collection;
    }

      /**
    * @var Domanda $dmn
    */
    public function map($dmn): array
    {      
        return [
            $dmn->email,
            $dmn->nome ? $dmn->nome : '',
            $dmn->cognome ? $dmn->cognome : '',
            $dmn->descrizione,

            __('global.'.$dmn->sessione),
            $dmn->periodo_riferimento,
            __('global.'.$dmn->current_state),

            $dmn->data_data_inoltro,
            $dmn->ora_inoltro,
            $dmn->num_prot ? $dmn->num_prot : ''
        ];
    }


    public function headings(): array
    {
        return [
            'Email',
            'Nome',
            'Cognome',
            'Titolo bando',
            'Sessione',
            'Periodo',
            'Stato domanda',
            'Data inoltro',
            'Ora inoltro',
            'Num. protocollo'
        ];
    }

}
