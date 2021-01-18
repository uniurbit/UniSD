<?php

namespace App\Service;

use App\FindParameter;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\QueryBuilder;

class UtilService {

    public static function alldata($modelinstance, Request $request, $findparam){

        $findparam->limit = 10000;
        $findparam->page = null;
        
        $paginator = UtilService::query($modelinstance, $request, $findparam);
        $collection = collect($paginator->items());
       
        $page = 1;
        $total = $paginator->total();

        while($collection->count() < $total) {            
            $page = $page+1;

            $findparam->page = $page;
            
            $p = UtilService::query($modelinstance, $request, $findparam);   
            $collection = $collection->concat($p->items());
        }

        return $collection;
    }

    private static function query($modelinstance, Request $request, $findparam){        
        return (new QueryBuilder($modelinstance, $request, $findparam))->build()->paginate();        
    }

    
    public static function allow_only($str, $allowed){
        $str = htmlspecialchars($str);
        foreach( $allowed as $a ){
            $str = preg_replace_callback("/&lt;(".$a."){1}([\s\/\.\w=&;:#]*?)&gt;/",  function ($match){
                return "<".$match[1].str_replace('&quot;','"',$match[2]).">";
            }, $str);//use quotes here 
            $str = str_replace("&lt;/".$a."&gt;", "</".$a.">", $str);
        }
        $str = str_replace("&amp;#160;","&#160;", $str);
        return $str;
    }

}