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
  
  <h4 style="margin-left: -28mm; margin-right: -28mm">DOMANDA DI PARTECIPAZIONE ALLA PROCEDURA DI VALUTAZIONE DI ATENEO 
  <br>PER L'ATTRIBUZIONE DEGLI SCATTI STIPENDIALI AI SENSI DELL'ART. 1, COMMA 629, DELLA LEGGE 205/2017 E DELL'ART. 6, COMMA 14, DELLA LEGGE 240/2010</h4>
  <br>
  <p class="normal" style="text-align: center;">Ai sensi e per gli effetti degli artt. 46 e 47 del D.P.R. 445/2000
  <br>"dichiarazioni sostitutive di certificazioni"
  <br>"dichiarazioni sostitutive dell'atto di notorietà"</p>
  <br>

    <p class="normal" style="margin-left: 80mm; font-weight: bold">
    Al Magnifico Rettore <br>
    dell'Università degli Studi di Urbino Carlo Bo
    </p>
  <br>
	<p class="normal">		
  {{ $dmn->userTitle() }}	{{ $dmn->user->nameTutorString() }} in servizio presso l'Università degli Studi di Urbino Carlo Bo {{ $dmn->periodoTitle() }}, 
  in qualità di  {{ $dmn->ruoloTitle() }}	  
  </p>	
  
    <h4>C H I E D E</h4>
    <p class="normal">	
    di partecipare alla procedura di valutazione di Ateneo per le procedure in epigrafe. A tal fine
    </p>
    <h4>D I C H I A R A</h4>
    <p class="normal">	
    in relazione al possesso dei requisiti previsti dal Regolamento di Ateneo:
    </p>
    <br>
    <p class="normal">	
    <span style="font-weight: bold">- con riferimento all'Attività Didattica </span>
    <br>
    @if($dmn->cont->flag_didattica )
      di aver adempiuto ai compiti didattici affidati {{ $dmn->numPeriodoTitle() }} accademico precedente la data della presente domanda;
    @else
      di non aver svolto attività didattica;
    @endif   
    <br>
    <br>
    @if($dmn->cont->flag_aspettativa )
      di aver fruito di periodi di assenza dal servizio {{ $dmn->numPeriodoTitle() }} accademico precedente la data della presente domanda;
    @else
      di non aver fruito di periodi di assenza dal servizio {{ $dmn->numPeriodoTitle() }} accademico precedente la data della presente domanda;
    @endif   
    </p>	 						    
    <br>
    <p class="normal">	
    <span style="font-weight: bold">- con riferimento all'Attività di Ricerca </span>
    <br>
      @if($dmn->cont->flag_ricerca )
        di aver    
      @else
        di non aver
      @endif
     conferito prodotti della ricerca a processi di valutazione della stessa {{ $dmn->numPeriodoTitle() }} solare precedente la data della presente domanda, 
     fatto salvo quanto previsto dall'art. 7, comma 2, del Regolamento di Ateneo;
    </p>
    <br>
    <p class="normal">	
    <span style="font-weight: bold">- con riferimento all'Attività Gestionale</span>
    <br>
      @if($dmn->cont->flag_gestionale )
         di aver    
      @else 
        di non aver
      @endif   
      svolto attività gestionali {{ $dmn->numPeriodoTitle() }} accademico precedente la data della presente domanda, fatto salvo quanto disposto dall'art. 7, comma 2, del Regolamento di Ateneo.
    </p>
    
    <h4>I N F I N E  <span style="margin-left:2mm">D I C H I A R A</span></h4>

    <p class="normal">
    @if($dmn->cont->flag_sanzioni )
      di essere        
    @else
      di non essere
    @endif    
      stato destinatario di una sanzione disciplinare {{ $dmn->numPeriodoTitle() }} di riferimento e di essere consapevole delle 
      responsabilità penali previste dagli artt. 75 e 76 del D.P.R. 445/2000 e s.m.i. per le ipotesi di falsità in atti e dichiarazioni mendaci.
    </p>

    @if($dmn->flag_reinoltro == 1)
    <br>
    <p class="normal">	
    La presente domanda sostituisce integralmente le precedenti inoltrate.
    </p>
    @endif
    <br>
    <p class="normal">	
    {{ $dmn->userTitle() }} allega alla presente domanda la relazione sul complesso delle attività didattiche, di ricerca e gestionali svolte {{ $dmn->periodoTitle() }}.
    </p>
    <br>
    <p class="normal">
    {{ Carbon\Carbon::now()->format(config('unidem.date_format_domanda'))}}<br>
    f.to {{ $dmn->user->nameTutorString() }}
    </p>
    <br>
    </div>
    {{-- RELAZIONE --}}
    <div class="page ">
    <div class="logo" ></div>
    <h4 style="text-align: left">1. CON RIFERIMENTO ALL'ATTIVITÀ DIDATTICA SVOLTA {{strtoupper($dmn->periodoTitle('ACCADEMICO')) }}  </h4>
    @if($dmn->cont->flag_didattica == 0)
    <p class="normal">
       - Nessuna attività didattica svolta {{ $dmn->numPeriodoTitle() }} accademico precedente.  
    </p>
    <br>
    @else
    <div style="display: inline">
    @include('templates.sdjson.relazioneAccademica', ['relaz' => $dmn->cont->didattica, 'dmn' => $dmn])
    </div>
    @endif

    <h4 style="text-align: left">2. CON RIFERIMENTO ALL'ATTIVITÀ DI RICERCA SVOLTA {{ strtoupper($dmn->periodoTitle('SOLARE')) }} </h4>
    @if($dmn->cont->flag_ricerca == 0)
    <p class="normal">
      - Nessuna attività di ricerca svolta {{ $dmn->numPeriodoTitle() }} solare precedente.
    </p>
    <br>
    @else
    <div style="display: inline">
    @include('templates.sdjson.relazioneSolare', ['relaz' => $dmn->cont->ricerca, 'dmn' => $dmn])
    </div>
    @endif

    <h4 style="text-align: left">3. CON RIFERIMENTO ALL'ATTIVITÀ GESTIONALE SVOLTA {{ strtoupper($dmn->periodoTitle('ACCADEMICO')) }} </h4>
    @if($dmn->cont->flag_gestionale == 0)
    <p class="normal">
      - Nessuna attività gestionale svolta {{ $dmn->numPeriodoTitle() }} accademico precedente.
    </p>
    <br>
    @else
    <div style="display: inline">
    @include('templates.sdjson.relazioneAccademica', ['relaz' => $dmn->cont->gestionale, 'dmn' => $dmn])
    </div>
    @endif

    <p class="normal">	
    {{ $dmn->userTitle() }} dichiara di essere consapevole delle responsabilità penali previste dagli artt. 75 e 76 del D.P.R. 445/2000 per le
     ipotesi di falsità in atti e dichiarazioni mendaci.
    </p>
    <br>
    <p class="normal">
    {{ Carbon\Carbon::now()->format(config('unidem.date_format_domanda'))}}<br>
    f.to {{ $dmn->user->nameTutorString() }}
    </p>

  </div>
</body>
</html>
