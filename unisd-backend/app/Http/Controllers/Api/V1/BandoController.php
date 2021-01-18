<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Bando;
use App\Repositories\BandoRepository;
use Auth;
use App\Exports\BandoExport;
use Carbon\Carbon;
use App\Service\EmailService;
class BandoController extends Controller
{
    private $repo;
    public function __construct(BandoRepository $repo){
        $this->repo = $repo;
    }

    public function index()
    {
        return Bando::all();
    }
 
    public function show($id)
    {
        $entity = Bando::with(['attachments','comunicazioni'])->find($id);
        
        $data= $entity->toArray();
        $data['candidati'] = $entity->candidati()->get()->implode('email', PHP_EOL);
        $data['commissione'] = $entity->commissione()->get()->implode('email', PHP_EOL);
        return $data;
    }

    public function store(Request $request) {
        
        if (!Auth::user()->hasPermissionTo('compila bando')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $data = [];
        $message = '';
        $success = true;
     
        $postData = $request->except('id', '_method');             
        $data = $this->repo->store($postData);
    
        return compact('data', 'message', 'success'); 
    }

    public function update(Request $request, $id)
    {
        if (!Auth::user()->hasPermissionTo('compila bando')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $data = [];
        $message = '';
        $success = true;
     
        $postData = $request->except('id', '_method');             
        $this->repo->updateBando($postData, $id);
    
        $data = $this->show($id);
        return compact('data', 'message', 'success'); 
    }

    public function queryparameter(Request $request){       
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'candidati,commissione'; 
    
        if (!Auth::user()->hasPermissionTo('search all bandi')){           

            if (Auth::user()->hasRole('op_docente')){
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "candidati.email",                
                    "value" => Auth::user()->email
                ]);
            } else {
                abort(403, trans('global.utente_non_autorizzato'));
            }
             
        }

        $findparam = new \App\FindParameter($parameters);
        return $findparam;
    }

    //filtrata per bandi candidato o tutti
    public function query(Request $request){ 
        $findparam = $this->queryparameter($request);

        $queryBuilder = new QueryBuilder(new Bando, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       
    }

    //filtrata per bandi commissione o tutti
    public function querycommissione(Request $request){ 
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'candidati,commissione'; 
    
        if (!Auth::user()->hasPermissionTo('search all bandi')){           

            if (Auth::user()->hasRole('op_commissione')){
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "commissione.email",                
                    "value" => Auth::user()->email
                ]);
            } else {
                abort(403, trans('global.utente_non_autorizzato'));
            }
             
        }

        $findparam = new \App\FindParameter($parameters);

        $queryBuilder = new QueryBuilder(new Bando, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       

        //costruzione della query
    }

     
    public function export(Request $request){
        //prendi i parametri 
        $findparam = $this->queryparameter($request);          
        return (new BandoExport($request,$findparam))->download('bandi.csv', \Maatwebsite\Excel\Excel::CSV,  [
            'Content-Type' => 'text/csv',
        ]);        
    }

    public function sendInfoEmail(Request $request){        

        if (!Auth::user()->hasPermissionTo('sending infoemail')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        
        
        $data = EmailService::sendEmailInfo($request->bando_id, $request->entity);
        $data->model = null;
        $message = 'Email inviata con successo';
        $success = true;            

        return compact('data', 'message', 'success');
    }
    
}
