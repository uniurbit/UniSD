@component('mail::message')
Gentile {{ $dmn->user->nameTutorString() }},
<br>
con riferimento al bando **{{$dmn->bando->descrizione}}**,
le inviamo in allegato la domanda inoltrata.<br>            

Cordiali saluti.<br>
@component('mail::sign')
Università degli Studi di Urbino Carlo Bo<br>
@endcomponent
@endcomponent
