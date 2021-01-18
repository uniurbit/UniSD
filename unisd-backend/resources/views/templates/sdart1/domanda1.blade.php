<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	
	<style type="text/css">
	  html, body, p, ul, li, span, img {
      margin: 0px;      
      padding: 0px;
    }
    body {     
      margin-left: 28mm;
      margin-right: 28mm;
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 12pt;		
      text-rendering: geometricPrecision;         
                    
    } 

    .bozza {
      background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='1200px' width='1000px'><text x='700' y='300' fill='#f7d0cd' font-size='150pt' font-family='Arial' transform='rotate(45)'>BOZZA</text></svg>");
      background-repeat: repeat-y; 
      background-position: left center;
      background-attachment: fixed;
      background-size:100%;
    }

	  h4 {
      font-size: 12pt;	    
      text-align: center;
      line-height: 1.2;
      margin-bottom: 0;
      text-rendering: geometricPrecision;
	  }	 
    div.page
    {
        page-break-after: always;
        page-break-inside: avoid;
    } 
	  .normal {
		font-family:  Arial, Helvetica, sans-serif;
		font-size: 12pt;		
    text-rendering: geometricPrecision;
 		line-height: 1.4;
     text-align: justify;
      word-break: break-word;
	  }
    .element {
		font-family:  Arial, Helvetica, sans-serif;
		font-size: 12pt;		
 		line-height: 1.4;
    text-rendering: geometricPrecision;
    text-align: justify;
      word-break: break-word;
	  }
    .small {
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 11pt;		
      text-rendering: geometricPrecision;
      line-height: 1.7;
      text-align: left
	  }
    .infor {
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 11pt;		
      text-rendering: geometricPrecision;
      line-height: 1.3;
      text-align: justify
	  }
    .subtitleinfor {
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 12pt;
      font-weight: bold;		
      text-rendering: geometricPrecision;
      line-height: 1.5;
      text-align: left
    }
	  .piepagina {		
      font-size: 9pt;		
      font-family: Arial, Helvetica, sans-serif;		
      text-align: left;					
	  }   
	</style>
</head>
<body class="@if ($type=='DOMANDA_BOZZA') bozza @endif">
<div class="page">
    <h4 style="margin-left: -28mm; margin-right: -28mm; padding-top: 30px">DOMANDA DI PARTECIPAZIONE ALLA PROCEDURA DI VALUTAZIONE DI ATENEO 
    <br>PER L'ATTRIBUZIONE DEGLI SCATTI STIPENDIALI PER IL BIENNIO {{ $dmn->bando->periodo_riferimento }} AI <br> 
    SENSI DELL'ART. 1, COMMA 629, DELLA LEGGE 27 DICEMBRE 2017, N. 205, ED AI <br> 
    SENSI DELL'ART. 6, CO. 14, DELLA LEGGE 240/2010</h4>
    <br style="line-height: 1">
    @include('templates.common.domanda', ['dmn' => $dmn, 'periodo' => 'biennio'])
 </div>
  <div class="page">
    <h4 style="margin-left: -28mm; margin-right: -28mm">RELAZIONE SUL COMPLESSO DELLE ATTIVITÀ DIDATTICHE, DI RICERCA <br>
    E GESTIONALI NEL BIENNIO {{ $dmn->bando->periodo_riferimento }}</h4>   
    @include('templates.common.relazione', ['dmn' => $dmn, 'anni' => 2, 'periodo' => 'biennio'])
  </div>
</body>
</html>
