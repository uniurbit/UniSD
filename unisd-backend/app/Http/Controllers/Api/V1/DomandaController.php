<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Bando;
use App\Domanda;
use App\Repositories\DomandaRepository;
use App\Service\DomandaService;
use Auth;
use PDF;
use App;
use View;
use Storage;
use App\Service\TitulusHelper;
use App\Exports\DomandaExport;
use Carbon\Carbon;
class DomandaController extends Controller
{
    private $repo;
    public function __construct(DomandaRepository $repo){
        $this->repo = $repo;
    }

    public function index()
    {
        return null;
    }
 
    public function show($id)
    {

        $entity = Domanda::withoutGlobalScopes()->with(['bando','user','attachments','bando.attachments'])->find($id);
        
        if (!Auth::user()->hasPermissionTo('search all domande')){
            if ($this->checkDocente($entity) || $this->checkCommissione($entity)){
                return $entity;
            }else{
                abort(403, trans('global.utente_non_autorizzato')); 
            }
        }

        return $entity;
    }

    public function checkDocente($entity){
        return Auth::user()->hasRole('op_docente') && Auth::user()->id == $entity->user_id;
    }

    public function checkCommissione($entity){
        $membro = $entity->bando->commissione()->where('email',Auth::user()->email)->first();
        if ($membro == null || !$entity->bando->isCommissioneValidDate()){
            return false;
        }
        return true;
    }

    public function store(Request $request) {
        
        if (!Auth::user()->hasPermissionTo('compila domanda')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $bando = Bando::where('id', $request->bando_id)->first();
        if ($bando->isBlocked()){
            $data = [];
            $message = trans('global.inoltro_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }     

        //dopo la riunione con l'uffico docenti 
        //è possibile inserire più domande ma una sola in stato di bozza
        $domanda = Domanda::withoutGlobalScopes()->where('user_id',Auth::user()->id)->where('stato',0)->where('bando_id',$request->bando_id)->first();
        if ($domanda != null){
            $data = [];
            $message = trans('global.domanda_esistente');
            $success = false;
            return compact('data', 'message', 'success');   
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
        if (!Auth::user()->hasPermissionTo('compila domanda')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $dmn = Domanda::withoutGlobalScopes()->with(['bando'])->where('id', $id)->first();
        if ($dmn->isBlocked()){
            $data = [];
            $message = trans('global.inoltro_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }      

        $data = [];
        $message = '';
        $success = true;
     
        $postData = $request->except('id', '_method');             
        $this->repo->updateDomanda($postData, $id);
    
        $data = $this->show($id);
        return compact('data', 'message', 'success'); 
    }

    public function queryparameter(Request $request){       
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'bando,user'; 
    
        if (!Auth::user()->hasPermissionTo('search all domande')){           

            if (Auth::user()->hasRole('op_docente')){
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "user_id",                
                    "value" => Auth::user()->id
                ]);
            } else {
                abort(403, trans('global.utente_non_autorizzato'));
            }
             
        }

        $findparam = new \App\FindParameter($parameters);
        //$findparam->order_by = 'u.cognome,ASC|domande.id,DESC';
        $findparam->order_by = 'domande.id,DESC';
        return $findparam;
    }

    //filtrata per bandi candidato
    public function query(Request $request){ 
        $findparam = $this->queryparameter($request);

        $queryBuilder = new QueryBuilder(new Domanda, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       
    }

     //filtrata per bandi candidato
     public function querycommissione(Request $request){ 
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'bando,user'; 
    
        if (!Auth::user()->hasPermissionTo('search all domande')){           

            if (Auth::user()->hasRole('op_commissione')){
                $toDay = Carbon::now()->setTimezone(config('unidem.timezone'))->format('Y-m-d');
                $userEmail = Auth::user()->email;

                $bandi = Bando::whereHas('commissione', function($query) use ($userEmail) { 
                     $query->where('email', $userEmail); 
                })->whereDate('data_fine','<',$toDay)->select('id')->get();

                if ($bandi==null){
                    abort(403, trans('global.utente_non_autorizzato'));
                }

                $ids = $bandi ? $bandi->pluck('id')->toArray() : [];
                array_push($parameters['rules'],[
                    "operator" => "In",
                    "field" => "bando_id",                
                    "value" => $ids
                ]);
          
            } else {
                abort(403, trans('global.utente_non_autorizzato'));
            }
             
        }

        $findparam = new \App\FindParameter($parameters);

        $queryBuilder = new QueryBuilder(new Domanda, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       

     
    }

    public function intestazioneBando($id){

        //determinare se esiste una domanda 
        
        $data = [];
        $message = '';
        $success = true;

        //ultima domanda presenta
        $domanda = Domanda::withoutGlobalScopes()->with(['user','bando','bando.attachments'])->orderBy('id', 'desc')->where('user_id',Auth::user()->id)->where('bando_id',$id)->first();

        if ($domanda==null){
            $entity = Bando::with(['attachments'])->find($id);

            $data = $entity->toArray();
            $user = Auth::user();
            $data['user'] = $user;
    
        }else{
            $success =false;
            $message='Domanda esistente';
            //restituisco l'ultima domanda inserita
            $data = $domanda;
        }
       
        return compact('data', 'message', 'success'); 
    }
    
    public function previewDomanda($id){
   
        $attach = null;
        $type ='DOMANDA_BOZZA';
        $dmn = Domanda::withoutGlobalScopes()->with('bando','bando.template','user')->find($id);

        if (!Auth::user()->hasPermissionTo('search all domande')){           
            if (Auth::user()->hasRole('op_docente')){
                if (Auth::user()->id != $dmn->user_id){
                    abort(403, trans('global.utente_non_autorizzato'));
                }
            }else{
                abort(403, trans('global.utente_non_autorizzato'));
            }
        }

        $pdf = DomandaService::makePdfForDomanda($dmn, $type);
      
        $attach['attachmenttype_codice'] =  $type;
        $attach['filename'] = 'Domanada'. $dmn->user->nameTutorString() .'.pdf';
        try {
            $value = $pdf->download();
            $attach['filevalue'] =  base64_encode( $value);
        } catch (\Throwable $th) {
            throw $th;
        }        
        
        return $attach;  
    }

    public function terminaInoltra(Request $request){
        if (!Auth::user()->hasPermissionTo('terminainoltra domanda')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    

        $dmn = Domanda::withoutGlobalScopes()->with(['bando'])->where('id', $request->id)->first();
        if (Auth::user()->hasRole('op_docente') && !Auth::user()->hasRole('super-admin')){
           if (Auth::user()->id != $dmn->user_id){
                abort(403, trans('global.utente_non_autorizzato'));
           }
        }

        $success = true;
        $message = '';        
        $data = [];        
        
        if ($dmn->isBlocked()){
            $data = [];
            $message = trans('global.inoltro_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }      
       
        if ($dmn->stato==0){
            $postData = $request->except('_method');        
            $data = $this->repo->terminaInoltra($postData);        
        }else{
            $success = false;  
            $message = 'Operazione termina già eseguita';
        }
    
        return compact('data', 'message', 'success');
    }

    public function downloadDomanda($id){

        if (!Auth::user()->hasPermissionTo('view attachments')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $entity = Domanda::withoutGlobalScopes()->with(['attachments','bando','bando.commissione'])->find($id);

        if (!Auth::user()->hasPermissionTo('search all domande')){           
            if ($this->checkDocente($entity) || $this->checkCommissione($entity)){
                //return $entity;
            }else{
                abort(403, trans('global.utente_non_autorizzato')); 
            }
        }

        $attach =  $entity->attachments()->where('attachmenttype_codice','DOMANDA')->first();
        if ($attach){
            if ($attach['type'] != 'empty' && $attach['filepath']){                        
                $attach['filevalue'] = base64_encode(Storage::get($attach->filepath));
            }
        }
        return $attach;
        //scaricare l'allegato da titulus
    
    }

    
    public function export(Request $request){
        //prendi i parametri 
        $findparam = $this->queryparameter($request);          
        return (new DomandaExport($request,$findparam))->download('domande.csv', \Maatwebsite\Excel\Excel::CSV,  [
            'Content-Type' => 'text/csv',
        ]);        
    }
}
