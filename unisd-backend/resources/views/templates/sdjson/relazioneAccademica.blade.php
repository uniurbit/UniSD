@if($relaz!= null)
    @if(isset($relaz->descr_1) && $relaz->descr_1 != null)
    <span style="font-weight: bold">- A.A. {{$dmn->annoAcc(1)}}</span>
    <p class="element">
    {!!nl2br(e($relaz->descr_1))!!}
    <!-- {!!nl2br(Markdown::parse(e($relaz->descr_1)))!!} -->
    <!-- {!!nl2br(MyUtilService::allow_only($relaz->descr_1,['b','i','div','br']))!!} -->
    </p>
    <br>
    @endif

    @if(isset($relaz->descr_2) && $relaz->descr_2 != null)
    <span style="font-weight: bold">- A.A. {{$dmn->annoAcc(2)}} </span>
    <p class="element">
    {!!nl2br(e($relaz->descr_2))!!}
    </p>
    <br>
    @endif

    @if(isset($relaz->descr_3) && $relaz->descr_3 != null)
    <span style="font-weight: bold">- A.A. {{$dmn->annoAcc(3)}} </span>
    <p class="element">
    {!!nl2br(e($relaz->descr_3))!!}
    </p>
    <br>
    @endif
@endif

