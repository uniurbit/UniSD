<?php

namespace App\Http\Controllers\Api\V1;
 
use App\Http\Controllers\Controller;
use App\Message;
use App\User;
use App\Notifications\NotificaDocente;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
use Auth;
use App\CandidatoDomanda;
use App\Exports\CandidatoExport;
 
class CandidatoController extends Controller
{
    
    public function queryparameter(Request $request){       
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'bando'; 
    
        if (!Auth::user()->hasPermissionTo('search all domande')){           
            abort(403, trans('global.utente_non_autorizzato'));
        }

        $findparam = new \App\FindParameter($parameters);
        return $findparam;
    }

    //filtrata per bandi candidato o tutti
    public function query(Request $request){ 
        $findparam = $this->queryparameter($request);
        $findparam->order_by = 'u.cognome,ASC|d.id,DESC';

        $queryBuilder = new QueryBuilder(new CandidatoDomanda, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       
    }

    public function export(Request $request){
        //prendi i parametri 
        $findparam = $this->queryparameter($request);
        $findparam->order_by = 'u.cognome,ASC|d.id,DESC';

        return (new CandidatoExport($request,$findparam))->download('candidati.csv', \Maatwebsite\Excel\Excel::CSV,  [
            'Content-Type' => 'text/csv',
        ]);        
    }




   
}
