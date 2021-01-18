<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	

<style type="text/css">
    html, body, p, ul, li, span, img {
        margin: 0px;      
        padding: 0px;
    }

    body {        
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12pt;
        line-height: 1.7;		                                  
        text-rendering: geometricPrecision;
    } 

    h2, h3, h4 { line-height: 100% }

    th { 
       font-size: 10pt;
       text-rendering: geometricPrecision;
       padding-bottom:10px;
    }

    td {
        padding-bottom:10px;    
    }

    
    div.page {
        page-break-after: always;
        page-break-inside: avoid;
    } 

    .normal {
        font-family:  Arial, Helvetica, sans-serif;
        font-size: 9pt;		
        text-rendering: geometricPrecision;
        line-height: 1.7;
        text-align: justify
    }

</style>
</head>

<body>


<hr>
<h3>{{ __('global.ufficio') }}</h3>
Data del documento: {{ Carbon\Carbon::now()->format(config('unidem.date_format'))}}
<hr>
<h2 style="padding-top: 10px;">ELENCO DOMANDE</h2>
<!-- <div class="page"> -->
    <table cellspacing="0" border="0" width="100%" style="padding-top: 10px;">
        <thead>    
            <tr>
                <th style="width: 5%;">Progr.</th>
                <th style="width: 13%;text-align: left;">Nominativo</th>
                <th style="width: 40%;text-align: left;">Descrizione</th>
                <th style="width: 7%; ">Data inoltro</th>
                <th style="width: 7%; ">Num. protocollo</th>
                <th style="width: 7%; ">Stato</th>
            </tr>
        </thead>
        <tbody>           
            @foreach($entities as $entity)
            <tr>
                <td style="width: 5%; text-align: center;">{{$loop->iteration}}</td>
                <td style="width: 13%">{{$entity->user->nameTutorString()}}</td>
                <td style="width: 40%">{{$entity->bando->descrizione}}</td>
                <td style="width: 7%; text-align: center;">{{$entity->data_inoltro}}</td>                
                <td style="width: 7%; text-align: center;">{{$entity->num_prot}}</td>                
                <td style="width: 7%; text-align: center;">{{$entity->stato}}</td>
            </tr>
            @endforeach
        </tbody>
    </table>    
<!-- </div> -->


@endif
</body>
</html>
