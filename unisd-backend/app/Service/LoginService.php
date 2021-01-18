<?php

namespace App\Service;

use App\Personale;
use App\MappingRuolo;
use App\AnagraficaUgov;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class LoginService implements ApplicationService
{

    public function isAuthorized($email){
        $pers = Personale::FindByEmail($email); 
        return $pers->isDocente() || $pers->isPta();
    }

   /**
    * @param $email
    * i possibili ruoli sono 
    * ADMIN per gli afferenti al ssia
    * @return 
    */
   
    public function findUserRoleAndData($email)
    {   
        Log::info('findUserRole [ '. $email .']');    

        $pers = Cache::get('users/'.$email.':findbyemail', function () use($email) {
            return Personale::FindByEmail($email);
        });        
       
        if ($pers == null){

            Log::info('findDocenteData [ '. $email .']');              
            $pers = AnagraficaUgov::FindByEmail($email);
            $data = [
                'id_ab' => $pers->id_ab,
                'nome' =>ucwords(mb_strtolower($pers->nome, 'UTF-8')),
                'cognome' => ucwords(mb_strtolower($pers->cognome, 'UTF-8')),
                'sesso' => $pers->sesso,
                'ruoli'=> []
            ];
    
            return $data;
        }    

        return LoginService::roleAndData($pers);        
    }
    
    public function findUserRoleAndDataById($id)
    {   
        Log::info('findUserRole [ '. $id .']');              
        $pers = Personale::FindByIdAB($value['v_ie_ru_personale_id_ab']);           

        return LoginService::roleAndData($pers);     
    }

    public static function roleAndData($pers){
        $data = [
            'id_ab' => $pers->id_ab,
            'nome' =>ucwords(mb_strtolower($pers->nome, 'UTF-8')),
            'cognome' => ucwords(mb_strtolower($pers->cognome, 'UTF-8')),
            'sesso' => $pers->cd_genere,
        ];

        Log::info('Personale [ '. $pers->nome .']');         

        if ($pers->ruolo->isPta()){            
            //leggere ruolo da tabella configurazione unità ruolo
            $data['ruoli'] = MappingRuolo::where('unitaorganizzativa_uo',$pers->unita->uo)->get()->map(function ($mapping) {
                return $mapping->role->name;
            })->toArray();

            if (count($data['ruoli'])>0){                
                return $data;                    
            }else{
                Log::info('MappingRuolo [ NON TROVATO ]');   
            }
            
            $data['ruoli'] = ['viewer'];    
            return $data;
        }else{
            //NON è PTA
            $data['ruoli'] = [];
            return $data; 
        }

        Log::info('findUserRole [ NON TROVATO ]');   
        return null;
    }


}