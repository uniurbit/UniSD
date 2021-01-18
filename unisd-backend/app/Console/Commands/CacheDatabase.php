<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use App\User;
use App\Bando;
use App\Personale;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Builder;

class CacheDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cache oracle database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
           
            $toDay = Carbon::now()->setTimezone(config('unidem.timezone'))->format('Y-m-d');
            $bandi = Bando::whereDate('data_fine','>=',$toDay)->whereDate('data_inizio','<=',$toDay)->get();

            foreach ($bandi as $bando) {
                $candidati = $bando->candidati()->get();
                foreach ($candidati as $candidato) {
                    $user = $candidato->user()->first();
                    if ($user){
                        $r1 = $user->personaleRelation();
                        $r2 = $user->anagraficaugovRelation();
                    }else{

                        $pers = Personale::FindByEmail($candidato->email);
                        if (!($pers instanceof Builder)){
                            Cache::put('users/'.$candidato->email.':findbyemail', $pers, 60 * 24 * 20);  

                            $tmp = new User();
                            $tmp->v_ie_ru_personale_id_ab = $pers->id_ab;
                            $tmp->email = $candidato->email;

                            $r1 = $tmp->personaleRelation();
                            $r2 = $tmp->anagraficaugovRelation();
                        } else {
                            $this->info($candidato->email);
                        }

                    }
                }
            }

            $this->info('The cache has been proceed successfully for '.$bandi->count().' bandi');
        } catch (\Exception $e) {
            $this->error('The cache process has been failed.');
        }
    }
}
