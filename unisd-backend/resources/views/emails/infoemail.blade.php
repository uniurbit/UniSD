@component('mail::message')

{!!nl2br(e($entity['corpo_testo']))!!}

@component('mail::button', ['url' => $urlUniSD])
UniSD
@endcomponent

<br>
Per eventuali informazioni o richieste di chiarimento, può far riferimento ai recapiti di seguito indicati.
@component('mail::sign')
@include( 'emails.firmamessaggioamministrazione')
@endcomponent
@endcomponent