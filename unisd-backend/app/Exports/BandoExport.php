<?php

namespace App\Exports;

use App\Bando;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Service\UtilService;

class BandoExport implements FromCollection, WithMapping, WithHeadings
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
        $collection = UtilService::alldata(new Bando, $this->request, $this->findparam);        
        return $collection;
    }

      /**
    * @var Domanda $dmn
    */
    public function map($bando): array
    {      
        return [
            $bando->id,
            $bando->descrizione,
            $bando->sessione,
            $bando->data_inizio,
            $bando->data_fine,
            $bando->periodo_riferimento,
            $bando->stato,
        ];
    }

    public function headings(): array
    {
        return [
            '#',
            'Titolo bando',
            'Sessione',
            'Data inizio',
            'Data fine',
            'Periodo',
            'Stato',
        ];
    }

}
