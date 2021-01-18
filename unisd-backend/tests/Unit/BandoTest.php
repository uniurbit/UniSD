<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Bando;
use App\Domanda;
use App\User;
use App\Repositories\BandoRepository;
use App\Repositories\DomandaRepository;
use App\Service\DomandaService;
use App\Http\Controllers\Api\V1\DomandaController;
use Storage;
use App\Http\Controllers\SoapControllerTitulus;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Service\EmailService;

class BandoTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
     // ./vendor/bin/phpunit  --testsuite Unit --filter testBandoStore
    public function testBandoStore()
    {
              
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $repo = new BandoRepository($this->app);
        $response = $repo->store(BandoData::getBando());        
       
        $this->assertNotNull($response->id);
        $this->assertGreaterThan(0, $response->candidati()->count());
        $this->assertGreaterThan(0, $response->commissione()->count());
        $this->assertNotNull($response->num_fascicolo);
       
        $data = EmailService::sendEmailInfo($response->id, BandoData::getInfoEmail());

        $sc = new SoapControllerTitulus(new SoapWrapper); 
        try {
            $sc->rimuoviFascicolo($response->num_fascicolo);
        } catch (\Exception $e) {
            //throw $th;
        }

        $bando = Bando::find($response->id);
        $bando->candidati()->delete();
        $bando->commissione()->delete();
        $bando->delete();
        $this->assertTrue(true);

    }

     // ./vendor/bin/phpunit  --testsuite Unit --filter testDomandaStore
    public function testDomandaStore(){
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $repo = new BandoRepository($this->app);
        $responsebando = $repo->store(BandoData::getBando());  

        $repo = new DomandaRepository($this->app);
        $response = $repo->store(BandoData::getDomanda($responsebando->id));  
       
        $dmn = Domanda::withoutGlobalScopes()->with('bando','user')->find($response->id);
        $result = DomandaService::makePdfForDomanda($dmn,"DOMANDA_BOZZA");

        Storage::disk('local')->delete('test.pdf');    
        Storage::disk('local')->put('test.pdf', $result->download());      
        $exists = Storage::disk('local')->exists('test.pdf');        

        $dmn->delete();

        $bando = Bando::find($responsebando->id);
        $bando->candidati()->delete();
        $bando->commissione()->delete();
        $bando->delete();

        $this->assertTrue($exists);
    }


        // ./vendor/bin/phpunit  --testsuite Unit --filter testDomandaTerminaInoltraStore
        public function testDomandaTerminaInoltraStore(){
            $user = User::where('email','enrico.oliva@uniurb.it')->first();
            $this->actingAs($user);
    
            $repo = new BandoRepository($this->app);
            $responsebando = $repo->store(BandoData::getBando());  
    
            $repo = new DomandaRepository($this->app);
            $response = $repo->store(BandoData::getDomanda($responsebando->id));  
           
            $request = new \Illuminate\Http\Request();
            $request->setMethod('POST');                
            $request->replace($response->toArray());

            $controller = new DomandaController($repo);
            $result = $controller->terminaInoltra($request);

            // $dmn = $repo->terminaInoltra([
            //     "id" => $response->id
            // ]);
       
            $this->assertNotNull($result['data']);
            $this->assertTrue($result['success']);

            $dmn = Domanda::withoutGlobalScopes()->where('id',$response->id)->first();
            $this->assertNotNull($dmn->num_prot);

            $dmn->delete();
    
            $bando = Bando::find($responsebando->id);
            $bando->candidati()->delete();
            $bando->commissione()->delete();
            $bando->delete();

        }



}
