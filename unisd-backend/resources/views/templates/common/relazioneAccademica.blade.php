@if($relaz!= null)
    @if(isset($relaz->descr_1) && $relaz->descr_1 != null && && $anni>=1)
    <span style="font-weight: bold">- A.A. {{$dmn->annoAcc(1)}}</span>
    <p class="element">
    {!!nl2br(e($relaz->descr_1))!!}
    </p>
    <br>
    @endif

    @if(isset($relaz->descr_2) && $relaz->descr_2 != null && $anni>=2)
    <span style="font-weight: bold">- A.A. {{$dmn->annoAcc(2)}} </span>
    <p class="element">
    {!!nl2br(e($relaz->descr_2))!!}
    </p>
    <br>
    @endif

    @if(isset($relaz->descr_3) && $relaz->descr_3 != null && $anni>=3)
    <span style="font-weight: bold">- A.A. {{$dmn->annoAcc(3)}} </span>
    <p class="element">
    {!!nl2br(e($relaz->descr_3))!!}
    </p>
    <br>
    @endif
@endif

