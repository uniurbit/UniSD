<?php

use Illuminate\Database\Seeder;
use App\Role;
use App\Permission;
//php artisan db:seed --class=RolesTableSeeder 
//php artisan migrate:fresh --seed
class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => 'create domande']);
        Permission::create(['name' => 'update domande']);
        Permission::create(['name' => 'delete domande']);
        Permission::create(['name' => 'view domande']);     
                        
        Permission::create(['name' => 'create attachments']);
        Permission::create(['name' => 'update attachments']);
        Permission::create(['name' => 'delete attachments']);
        Permission::create(['name' => 'view attachments']);        

        //permessi mappingruoli
        Permission::create(['name' => 'create mappingruoli']);
        Permission::create(['name' => 'update mappingruoli']);
        Permission::create(['name' => 'delete mappingruoli']);
        Permission::create(['name' => 'view mappingruoli']);          

        //permessi ricerche
        Permission::create(['name' => 'search all domande']);  
        Permission::create(['name' => 'search commissione domande']);
        Permission::create(['name' => 'search orgunit domande']);  

        Permission::create(['name' => 'search all bandi']);  
        Permission::create(['name' => 'search orgunit bandi']);  

        //permessi B1ConflittoInteressi
        
        Permission::create(['name' => 'terminainoltra domanda']);        
        Permission::create(['name' => 'validazioneamm domanda']);  
        Permission::create(['name' => 'annullaamm domanda']);            
        Permission::create(['name' => 'rinuncia domanda']);     
        
        Permission::create(['name' => 'compila domanda']);   
        Permission::create(['name' => 'compila bando']); 

        Permission::create(['name' => 'sending infoemail']); 

      
        // create roles and assign created permissions
        $role = Role::create(['name' => 'op_docente']);
        $role->givePermissionTo(['view domande', 
                'search orgunit domande', 
                'search orgunit bandi',
                'view attachments', 'terminainoltra domanda', 'compila domanda']);

        // this can be done as separate statements
        $role = Role::create(['name' => 'viewer']);
        $role->givePermissionTo(['view domande', 'search orgunit domande', 'search orgunit bandi']);
             
        $role = Role::create(['name' => 'op_uff_amm']);
        $role->givePermissionTo(['compila bando','search all domande','view attachments','search all bandi','update domande', 'validazioneamm domanda', 
                'annullaamm domanda','sending infoemail']);

        $role = Role::create(['name' => 'op_commissione']); 
        $role->givePermissionTo(['view domande', 'view attachments',
                                    'search commissione domande']);

        //super admin
        $role = Role::create(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());        
       
        //amministratore
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());
        $role->revokePermissionTo('search all domande');
        $role->revokePermissionTo('search all bandi');
        
        $role = Role::create(['name' => 'limited']); 
        $role->givePermissionTo(['search orgunit domande']);     
        $role->givePermissionTo(['search orgunit bandi']); 


        $this->command->info('created roles');

    }
}
