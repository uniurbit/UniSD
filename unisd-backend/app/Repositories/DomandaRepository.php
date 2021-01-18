<?php 
namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Auth;
use App\Attachment;
use App\User;
use App\Bando;
use App\Domanda;
use App\Candidato;
use App\Membro;
use App\Didattica;
use App\Ricerca;
use App\Gestionale;
use Illuminate\Support\Facades\Log;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use App\Service\DomandaService;
use App\Service\EmailService;
use Carbon\Carbon;
use App\Audit;
use Illuminate\Support\Str;


class DomandaRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Domanda';
    }

    private function readCSV($data){
        $lines = preg_split('/\n|\r\n?/', $data); //explode(PHP_EOL, $data);
        $array = array();
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line){
                $array[] = str_getcsv($line);
            }
        }
        return collect($array);
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        $entity = null;
        try{
            //$pers =Auth::user()->personale()->first();
            $pers =Auth::user()->personaleRelation()->first();
            $entity = new Domanda();
            $entity->ruolo = $pers->cd_ruolo;
            $entity->bando_id = $data['bando_id'];
            $user =Auth::user();
            $entity->user()->associate($user);
            $entity->fill($data);
            $entity->contenuto = json_encode($data['contenuto'],JSON_FORCE_OBJECT); 
            $success = $entity->save();    

            // 'flag_didattica',
            // 'flag_ricerca',
            // 'flag_gestionale',
            // 'flag_aspettativa',
            // 'flag_sanzioni',

              
        }
        catch(\Exception $e)
        {
            //failed logic here
            DB::rollback();
            throw $e;
        }

        DB::commit();       
        return $entity;
    }

    
    public function updateDomanda(array $data, $id){ 
        DB::beginTransaction(); 
        $entity = null;
        try{

            $pers =Auth::user()->personaleRelation()->first();
            $entity = Domanda::withoutGlobalScopes()->findOrFail($id); 
            $entity->ruolo = $pers->cd_ruolo; 
            $entity->contenuto = json_encode($data['contenuto'],JSON_FORCE_OBJECT); 
            $success = $entity->update($data);           
              
        }
        catch(\Exception $e)
        {
            //failed logic here
            DB::rollback();
            throw $e;
        }

        DB::commit();       
        return $entity;
    }


      /**
     *  $data lista di attachments
     *  $model istanza del modello a cui associare i file 
     */
    public function saveAttachments($data, $model, $emptyPermission = false){
        foreach ($data as $valore){ 
            $saved = false;

            $valore['model_type'] = get_class($model);        
            $attachment = new Attachment($valore);        
            $attachment->model()->associate($model);
            if (array_key_exists('filevalue',$valore) && $attachment->loadStream($valore['filevalue']) != null ){                
                $model->attachments()->save($attachment);
                $saved = true;
            }else{                
                if ($attachment->nrecord && $attachment->num_prot && $attachment->createLink($attachment->num_prot)){
                    $model->attachments()->save($attachment);
                    $saved = true;
                } else{
                    if ($emptyPermission && $attachment->createEmptyFile()){
                        $model->attachments()->save($attachment);
                        $saved = true;
                    }                    
                }
            }

            if (array_key_exists('id',$valore) && $saved){  
                $attach = Attachment::find($valore['id']);
                if ($attach)
                    $attach->delete();
            } 
                        
        }
    }

    public function terminaInoltra(array $data){
        DB::beginTransaction(); 
        try {

            $dmn = Domanda::withoutGlobalScopes()->with('bando','bando.template','user')->find($data['id']);
            //invio email 

            //creazione dell'allegato 
            $result = DomandaService::saveDomandaTitulus($dmn);
            $this->saveAttachments([$result], $dmn);
        
            DomandaService::aggiungiAlFascicolo($dmn,$result);

            EmailService::sendEmailDomanda($dmn, base64_decode($result['filevalue']), $result['filename']);

            //porto tutti i flag a false
            Domanda::withoutGlobalScopes()->where('flag_ultima',true)
                 ->where('user_id',Auth::user()->id)
                 ->where('bando_id',$dmn->bando_id)->update(['flag_ultima'=>false]);

            $dmn->num_prot = $result['num_prot'];
            $dmn->data_inoltro = Carbon::now(); //->setTimezone(config('unidem.timezone'));
            $dmn->stato = 1;
            $dmn->flag_ultima = true;
            $dmn->save();


        } catch(\Exception $e) {
            // failed logic here
            DB::rollback();
            throw $e;
        }
        DB::commit();  

        $dmn = $dmn = Domanda::withoutGlobalScopes()->with(['attachments','bando','user'])->where('id', $data['id'])->first();
        return $dmn;
    }
}