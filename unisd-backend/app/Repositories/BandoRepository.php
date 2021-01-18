<?php 
namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use App\Bando;
use App\Candidato;
use App\Membro;
use Illuminate\Support\Facades\Log;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Audit;
use Illuminate\Support\Str;
use App\Service\DomandaService;

class BandoRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Bando';
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

          

            $entity = new Bando();
            $entity->fill($data);
            $response = DomandaService::createFascicolo($entity);
            $entity->num_fascicolo = $response['num_fascicolo'];
            $success = $entity->save();            
            
            $candidati = $this->readCSV($data['candidati'])->map(function ($item) {
                if ($item[0] && Str::contains($item[0],'@uniurb.it')){
                    return new Candidato(['email' =>$item[0]]);
                }
            });
            $entity->candidati()->saveMany($candidati);

            if ($data['commissione']){
                $commissione = $this->readCSV($data['commissione'])->map(function ($item) {
                    if ($item[0] && Str::contains($item[0],'@uniurb.it')){
                        return new Membro(['email' =>$item[0]]);
                    }
                });
                $entity->commissione()->saveMany($commissione);
            }
                                   
            //salvare allegati ...             
            if (array_key_exists('attachments',$data)){              
                $this->saveAttachments($data['attachments'], $entity);
            } 

            // $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            // $precontr->anagrafica()->associate($entity);      
            // $precontr->save();                 

              
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

    
    public function updateBando(array $data, $id){ 
        DB::beginTransaction(); 
        $entity = null;
        try{

            $entity = Bando::findOrFail($id);   
            $success = $entity->update($data);           
            
            $candidati = $this->readCSV($data['candidati'])->map(function ($item) {
                return new Candidato(['email' =>$item[0]]);
            });
            $entity->candidati()->delete();
            $entity->candidati()->saveMany($candidati);

            if ($data['commissione']){
                $commissione = $this->readCSV($data['commissione'])->map(function ($item) {
                    return new Membro(['email' =>$item[0]]);
                });
                $entity->commissione()->delete();
                $entity->commissione()->saveMany($commissione);
            }
                                   
            //salvare allegati ...             
            if (array_key_exists('attachments',$data)){              
                $this->saveAttachments($data['attachments'], $entity);
            } 

            // $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            // $precontr->anagrafica()->associate($entity);      
            // $precontr->save();                 

              
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

            if (array_key_exists('id',$valore)){  
                $attach = Attachment::find($valore['id']);
                if ($saved){
                    if ($attach)
                        $attach->delete();
                }else{
                    $attach->description = $valore['description'];
                    $attach->save();
                }
             
            } 
                        
        }
    }

}