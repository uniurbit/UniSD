<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Comunicazione;
use App\Bando;
use App\Mail\DomandaEmail;
use App\Mail\InfoEmail;
use Illuminate\Support\Facades\Mail;
use DB;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\CandidatoDomanda;

class EmailService implements ApplicationService
{
    public static function sendToDocente($email, $dmn, $tolocal = null){
   
        if (App::environment(['local','preprod'])) {
            //$anagrafica = $dmn->user->anagraficaugovRelation()->first();
            //sviluppo debug
            if (Auth::user()){
                Mail::to(Auth::user())->send($email);            
            }else{
                //nel caso di comandi schedulati 
                Mail::to(config('unidem.administrator_email'))->send($email);                    
            }                                    
        } else {
            //leggo email privata da ugov (non esiste ancora l'anagrafica locale)
            //$anagrafica = $dmn->user->anagraficaugov()->first();
            try{

                $anagrafica = $dmn->user->anagraficaugovRelation()->first();
                
                Mail::to($dmn->user)
                    ->cc($anagrafica->e_mail_privata ?: [])
                    ->bcc(config('unidem.administrator_email'))->send($email);

            }catch(Exception $e){

                Log::error($e);
                Mail::to($dmn->user)
                    ->bcc(config('unidem.administrator_email'))->send($email);
            }

            
        }          

    }

    public static function sendToGroupBcc($email, $array_email, $tolocal = null){
   
        if (App::environment(['local','preprod'])) {
            //sviluppo debug
            if (Auth::user()){
                $to=[[
                    'email' => Auth::user()->email, 
                    'name' => "Undisclosed Recipient",
                ]];
                //$admins = array_map(function ($a) { return  ['email' => $a]; },  config('unidem.administrator_email'));
                //$result = array_merge($array_email, $admins);
                Mail::to($to)->send($email);              
            }else{
                //nel caso di comandi schedulati 
                Mail::to(config('unidem.administrator_email'))->send($email);                    
            }                                    
        } else {
           
            $to=[[
                'email' => config('unidem.ufficio_amministrazione'), 
                'name' => "Undisclosed Recipient",
            ]];
            $admins = array_map(function ($a) { return  ['email' => $a]; },  config('unidem.administrator_email'));
            $result = array_merge($array_email, $admins);
            Mail::to($to)
                ->bcc($result)->send($email);   
        }          

    }

    public static function sendToGroupCc($email, $array_email, $tolocal = null){
   
        if (App::environment(['local','preprod'])) {
            //sviluppo debug
            if (Auth::user()){
                $to=[[
                    'email' => Auth::user()->email, 
                    'name' => "Undisclosed Recipient",
                ]];
                Mail::to($to)->send($email);              
            }else{
                //nel caso di comandi schedulati 
                Mail::to(config('unidem.administrator_email'))->send($email);                    
            }                                    
        } else {
           
            $to=[[
                'email' => config('unidem.ufficio_amministrazione'), 
                'name' => "Undisclosed Recipient",
            ]];
            $admins = array_map(function ($a) { return  ['email' => $a]; },  config('unidem.administrator_email'));
            $result = array_merge($array_email, $admins);
            Mail::to($to)
                ->cc($result)->send($email);   
        }          

    }

    //funzione chiamata con comando schedulato
    public static function sendEmailDomanda($dmn, $document, $documentName){
                
        if ($dmn && $dmn->user->email &&  Str::contains($dmn->user->email,'@uniurb.it')){         

            $email = new DomandaEmail($dmn,$document,$documentName);        
            EmailService::sendToDocente($email,$dmn);     

        }else{        
            throw new Exception('A '.$dmn->user->nameTutorString().' non è associata una email istituzionale');
        }
    }
    
    public static function sendEmailInfo($bando_id, $entity){

            $bando = Bando::find($bando_id);

            $email = new InfoEmail($bando, $entity);
            
            if ($entity['gruppo']=='CANDIDATI'){
                $candidati = $bando->candidati()->get()->toArray();
                EmailService::sendToGroupBcc($email,$candidati); 

            }else if($entity['gruppo']=='COMMISSIONE'){
                $commissione = $bando->commissione()->get()->toArray();
                EmailService::sendToGroupBcc($email,$commissione);
            }else if ($entity['gruppo']=='CANDIDATI_NONINOLTRATA'){
                $candidati =  CandidatoDomanda::where('bando.id', $bando->id)
                    ->where(function ($query) {
                        $query->where('d.stato','=',0)->orWhereNull('d.stato');
                    })->get()->map->only(['email','bandoid'])->toArray();

                EmailService::sendToGroupBcc($email,$candidati); 

            }else{
                throw new Exception('Gruppo destinazione non riconosciuto');
            }

            $com = new Comunicazione();
            $com->user_id = Auth::user()->id;
          
            $com->codifica = "INFO";
            $com->oggetto =  $entity['oggetto'];
            $com->corpo_testo = $entity['corpo_testo'];
            $com->gruppo = $entity['gruppo'];
            $com->model()->associate($bando);
            
            $com->save();

            return $com;
            
    }
    


}
