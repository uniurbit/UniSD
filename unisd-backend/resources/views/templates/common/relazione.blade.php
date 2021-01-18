
   {{-- RELAZIONE --}}
    <br>
    <p class="normal">		
  {{ $dmn->userTitle() }}	{{ $dmn->user->nameTutorString() }} in servizio presso l'Università degli Studi di Urbino Carlo Bo {{$dmn->periodoTitle()}}, 
  in qualità di {{$dmn->ruoloTitle()}}, espone la seguente relazione sul complesso delle attività didattiche, 
  di ricerca e gestionali relative al {{ $dmn->peridoString() }} {{ $dmn->bando->periodo_riferimento}},
  dichiaro di aver svolto quanto segue:
  </p>	
    <h4 style="text-align: left">1. CON RIFERIMENTO ALL'ATTIVITÀ DIDATTICA SVOLTA NEL {{strtoupper($periodo)}} ACCADEMICO  {{ $dmn->bando->periodo_riferimento }}</h4>
    <br>
    @if($dmn->cont->flag_didattica == 0)
    <p class="normal">
       - Nessuna attività didattica svolta nel {{ $periodo }} {{ $dmn->bando->periodo_riferimento }} accademico precedente.  
    </p>
    <br>
    @else
    <div style="display: inline">
    @include('templates.sdjson.relazioneAccademica', ['relaz' => $dmn->cont->didattica, 'dmn' => $dmn, 'anni' => $anni])
    </div>
    @endif

    <h4 style="text-align: left">2. CON RIFERIMENTO ALL'ATTIVITÀ DI RICERCA SVOLTA NEL {{strtoupper($periodo)}} SOLARE  {{ $dmn->bando->periodo_riferimento }} </h4>
    <br>
    @if($dmn->cont->flag_ricerca == 0)
    <p class="normal">
      - Nessuna attività di ricerca svolta nel {{ $periodo }} {{ $dmn->bando->periodo_riferimento }} solare precedente.
    </p>
    <br>
    @else
    <div style="display: inline">
    @include('templates.sdjson.relazioneSolare', ['relaz' => $dmn->cont->ricerca, 'dmn' => $dmn, 'anni' => $anni])
    </div>
    @endif

    <h4 style="text-align: left">3. CON RIFERIMENTO ALL'ATTIVITÀ GESTIONALE SVOLTA NEL {{strtoupper($periodo)}} ACCADEMICO {{ $dmn->bando->periodo_riferimento }} </h4>
    <br>
    @if($dmn->cont->flag_gestionale == 0)
    <p class="normal">
      - Nessuna attività gestionale svolta nel {{ $periodo }} {{ $dmn->bando->periodo_riferimento }} accademico precedente.
    </p>
    <br>
    @else
    <div style="display: inline">
    @include('templates.sdjson.relazioneAccademica', ['relaz' => $dmn->cont->gestionale, 'dmn' => $dmn, 'anni' => $anni])
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



