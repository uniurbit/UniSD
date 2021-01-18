<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Domanda;
use App\Bando;
use Illuminate\Support\Facades\Mail;
use DB;
use PDF;
use App\Http\Controllers\SoapControllerTitulus;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Request\SaveParams;
use App\Soap\Request\AttachmentBean;
use App\Models\Titulus\Fascicolo;
use App\Models\Titulus\Documento;
use App\Models\Titulus\Rif;
use App\Models\Titulus\Element;
use Illuminate\Support\Facades\Log;
use App\MappingUfficio;
use Carbon\Carbon;
use View;


class DomandaService implements ApplicationService
{

    public static function makePdfForDomanda($dmn, $type){
        
        $pdf = PDF::loadView($dmn->bando->template->nome_template, ['dmn' => $dmn, 'type'=>$type]);      
        $pdf->setOption('enable-local-file-access',true);     
        if (App::environment(['local'])) {
            //con il javasctipt - something whent wrong in locale WINDOWS
            $header = View::make('headerlocal');      
            $pdf->setOption('header-html', $header);
        }else{            
            $header = View::make('header');      
            $pdf->setOption('header-html', $header);                       
        }
        $pdf->setOption('load-error-handling','ignore');
        $pdf->setOption('margin-top','30');                                    
        $pdf->setOption('margin-bottom','20');              
        $pdf->setPaper('a4');

        return $pdf;
    }

    public static function saveDomandaTitulus($dmn) {
        
        $sc = new SoapControllerTitulus(new SoapWrapper);

        $pdf = DomandaService::makePdfForDomanda($dmn, 'DOMANDA'); 

        $attachment = null;
        $attachment['filename'] = 'Domanda '. $dmn->user->nameTutorString() .'.pdf';        
        $filevalue = $pdf->download();

        $attachBeans = array();        
        if ($filevalue !=null){
            $attachmentTmp = new AttachmentBean();
            $attachmentTmp->setFileName($attachment['filename']);                
            $attachmentTmp->setDescription("Domanda");
            $attachmentTmp->setMimeType("application/pdf");
            $attachmentTmp->setContent($filevalue);      
            array_push($attachBeans,  $attachmentTmp);            
        }

        $newDoc = DomandaService::getDocumentoBozzaTitulus($dmn);
        Log::info('Chiamata saveDocument [' . $newDoc . ']');   

        $sd = new SaveDocument($newDoc, $attachBeans, new SaveParams(false,false));            
        $response = $sc->saveDocument($sd);
        Log::info('Risposta saveDocument [' . $response . ']');           
        //leggere risposta dmnndere i valori di num_prot nrecord e data_prot
        $obj = simplexml_load_string($response);
        $doc = $obj->Document->doc;

        $attachment['physdoc'] = (string) $doc['physdoc'];
        $attachment['nrecord'] = (string) $doc['nrecord'];
        $attachment['attachmenttype_codice'] = 'DOMANDA';
        $attachment['num_prot'] = (string) $doc['num_prot'];

        $attachment['emission_date'] =  Carbon::createFromFormat('Ymd', ((string) $doc['data_prot']))->format(config('unidem.date_format')); //aaaammgg
        Log::info('physdoc [' . $attachment['physdoc'] . ']');                   
        $attachment['filevalue'] =  base64_encode($filevalue);


        return $attachment;
    }

    public static function aggiungiAlFascicolo($dmn,$doc){
        $sc = new SoapControllerTitulus(new SoapWrapper);

        //aggiungi al fascicolo ...         
        $xmlInFolder = new Fascicolo();
        $xmlInFolder->rootElementAttributes->numero = $dmn->bando->num_fascicolo;
        $xmlInFolder->addDoc((string) $doc['nrecord']);

        Log::info('Chiamata addInFolder [' . $xmlInFolder->toXml() . ']');   
        $response = $sc->addInFolder($xmlInFolder->toXml());   
        return $response;
    }

    public static function getDocumentoBozzaTitulus($dmn){
       
        $doc = new Documento;
        $doc->rootElementAttributes->tipo = 'arrivo';         
        $doc->rootElementAttributes->bozza = 'no';

        //TODO epigrafe insegnamento
        $doc->oggetto = 'Domanda '. $dmn->bando->descrizione.' - '.$dmn->bando->sessioneTitle().' - '.$dmn->periodoTitle();
        $doc->addClassifCod('07/01');
        $doc->addAllegato('0 - nessun allegato');

        if (App::environment(['local','preprod'])) {
            $doc->addRPA("Ufficio Protocollo e Archivio", "Cappellacci Marco");
        } else{
            $doc->addRPA("Ufficio Amministrazione e Reclutamento Personale Docente", "Antonelli Gianluca"); 
        }
        $doc->addCC("Ufficio Amministrazione e Reclutamento Personale Docente", "tutti"); 
       
        $doc->addRifEsterno($dmn->user->nameTutorString());

        $newDoc = new \SimpleXMLElement($doc->toXml());    

        return $newDoc->asXML();
    }


    public static function createFascicolo($bando){
        $sc = new SoapControllerTitulus(new SoapWrapper);        
        $fasc = new Fascicolo;
        //2020-VII/1.-- «Procedura scatti stipendiali - prima sessione 2020»
        $fasc->oggetto = "Procedura scatti stipendiali (".$bando->descrizione.")";                
        $fasc->addClassifCod(config("unidem.classificazione"));

        if (App::environment(['local','preprod'])) {
            $fasc->addRPA("Ufficio Protocollo e Archivio", "Cappellacci Marco");
        } else{
            $fasc->addRPA(config('unidem.rpa_nome_ufficio'), config('unidem.rpa_nome_resp')); 
            //$fasc->addCC(config('unidem.rpa_nome_ufficio'), "tutti"); 
        }
             
        $response = $sc->newFascicolo($fasc->toXml());                

        $obj = simplexml_load_string($response);
        
        $data['nrecord'] = (string)$obj->Document->fascicolo['nrecord'];
        $data['num_fascicolo'] = (string)$obj->Document->fascicolo['numero'];

        return $data;
    }
}