<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\StrutturaEsterna;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\SoapControllerTitulusAcl;
use App\Service\QueryTitulusBuilder;

class StrutturaEsternaController extends Controller
{

    protected $sc;

    public function __construct() {
        $this->sc = new SoapControllerTitulusAcl();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {        
	        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }


    public function getminimal($id){
        $findparam = new \App\FindParameter([
            'rules' => [
                [
                    'field' => 'struest_coduff',
                    'operator' => '=',
                    'value' => $id
                ],
            ],
            'limit' => 1,
        ]);          

        $queryBuilder = new QueryTitulusBuilder(new StrutturaInterna, null, $this->sc, $findparam);

        return $queryBuilder->build()->get()->first();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {        
        //la load utilizza il physdoc o nrecord
        //va tradotta la risposta 
        $response = $this->sc->load($id);

        $objResult = simplexml_load_string($result);
        $model = new StrutturaEsterna;
    
        $arr= QueryTitulusBuilder::xmlToArray($objResult->document->struttura_esterna, []);
        $model->fill($arr);

        return $model;
    }
    
    public function query(Request $request){
       
        $queryBuilder = new QueryTitulusBuilder(new StrutturaEsterna, $request, $this->sc);

        return $queryBuilder->build()->paginate();               
    }        

}
