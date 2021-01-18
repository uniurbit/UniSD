
  <p class="normal" style="text-align: center;">(Ai sensi e per gli effetti degli artt. 46 e 47 del D.P.R. 445/2000 "dichiarazioni sostitutive di 
  <br>certificazioni" e "dichiarazioni sostitutive dell'atto di notorietà")</p>
  <br>

    <p class="normal" style="margin-left: 80mm; font-weight: bold">
    Al Magnifico Rettore <br>
    dell'Università degli Studi di Urbino Carlo Bo
    </p>
  <br>
	<p class="normal">		
  {{ $dmn->userTitle() }}	{{ $dmn->user->nameTutorString() }} in servizio presso l'Università degli Studi di Urbino Carlo Bo nel {{ $periodo }} {{ $dmn->bando->periodo_riferimento }}, 
  per il settore scientifico disciplinare {{ $dmn->user->personaleRelation()->first()->cd_ssd }} ({{ucwords(mb_strtolower($dmn->user->personaleRelation()->first()->ds_ssd, 'UTF-8'))}}) 
  in qualità di  {{ $dmn->ruoloTitle() }}	  
  </p>	
  
    <h4>C H I E D E</h4>
    <p class="normal">	
    di partecipare alla procedura di valutazione di Ateneo per l'attribuzione degli scatti stipendiali @if($periodo == 'biennio') biennali @else triennali @endif attivata per l'anno {{ $dmn->bando->annoAttivazione() }}, {{ $dmn->bando->sessioneTitle() }}, 
    prevista dall'articolo 6, comma 14 della Legge 240/2010 e dal relativo Regolamento di Ateneo emanato con Descreto Rettorale n. 177/2020 dal 4 maggio 2020. A tal fine
    </p>
    <h4>D I C H I A R A</h4>
    <p class="normal">	
    in relazione al possesso dei requisiti previsti dal Regolamento di Ateneo:
    </p>
    <br>
    <p class="normal">	
    <span style="font-weight: bold">- con riferimento all'Attività Didattica </span>
    <br>
    @if($dmn->cont->flag_didattica == 1)
      di aver adempiuto ai compiti didattici affidati nel {{ $periodo }} accademico precedente la data della presente domanda      
      @if(isset($dmn->cont->didattica->flag_didattica_conferma))
      @if($dmn->cont->didattica->flag_didattica_conferma == 1)
      e di confermare quanto dichiarato nell’attestazione sull’attività didattica rilasciata dalle strutture didattiche; 
      @else 
      e di non confermare quanto dichiarato nell’attestazione sull’attività didattica rilasciata dalle strutture didattiche;
      @endif   
      @endif
    @else
      di non aver svolto attività didattica;
    @endif   
    <br>
    <br>
    @if($dmn->cont->flag_aspettativa == 1)
      di aver fruito di periodi di assenza dal servizio nel {{ $periodo }} accademico precedente la data della presente domanda;
    @else
      di non aver fruito di periodi di assenza dal servizio nel {{ $periodo }} accademico precedente la data della presente domanda;
    @endif   
    </p>	 						    
    <br>
    <p class="normal">	
    <span style="font-weight: bold">- con riferimento all'Attività di Ricerca </span>
    <br>
      @if($dmn->cont->flag_ricerca == 1)
        di aver    
      @else
        di non aver
      @endif
     conferito prodotti della ricerca a processi di valutazione della stessa nel {{ $periodo }} solare precedente la data della presente domanda, 
     fatto salvo quanto previsto dall'art. 7, comma 2, del Regolamento di Ateneo;
    </p>
    <br>
    <p class="normal">	
    <span style="font-weight: bold">- con riferimento all'Attività Gestionale</span>
    <br>
      @if($dmn->cont->flag_gestionale == 1)
         di aver    
      @else 
        di non aver
      @endif   
      svolto attività gestionali nel {{ $periodo }} accademico precedente la data della presente domanda, fatto salvo quanto disposto dall'art. 7, comma 2, del Regolamento di Ateneo.
    </p>
    
    <h4>I N F I N E  <span style="margin-left:2mm">D I C H I A R A</span></h4>

    <p class="normal">
    @if($dmn->cont->flag_sanzioni == 1)
      di essere        
    @else
      di non essere
    @endif    
      stato destinatario di una sanzione disciplinare nel {{ $periodo }} di riferimento e di essere consapevole delle 
      responsabilità penali previste dagli artt. 75 e 76 del D.P.R. 445/2000 e s.m.i. per le ipotesi di falsità in atti e dichiarazioni mendaci.
    </p>
    <br>
    <p class="normal">	
    {{ $dmn->userTitle() }} allega alla presente domanda la relazione sul complesso delle attività didattiche, di ricerca e gestionali svolte {{ $dmn->periodoTitle() }}.
    </p>
    <br>
    <p class="normal">
     @if($dmn->flag_reinoltro == 1)
    La presente domanda sostituisce integralmente le precedenti inoltrate.<br>	
    @endif
    {{ Carbon\Carbon::now()->format(config('unidem.date_format_domanda'))}}<br>
    f.to {{ $dmn->user->nameTutorString() }}
    </p>
    <br>