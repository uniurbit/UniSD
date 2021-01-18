<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//auth:api https://github.com/tymondesigns/jwt-auth/blob/develop/docs/quick-start.md

//aggiornare la documentazione
//php artisan api:update


Route::group(['middleware' => ['cors','auth:api','log','role:super-admin','check'],  'namespace'=>'Api\V1'], function () {

    Route::get('mappingruoli', 'MappingRuoloController@index');
    Route::get('mappingruoli/{id}', 'MappingRuoloController@show');
    Route::post('mappingruoli/query', 'MappingRuoloController@query'); 
    Route::post('mappingruoli', 'MappingRuoloController@store');
    Route::put('mappingruoli/{id}', 'MappingRuoloController@update');
    Route::delete('mappingruoli/{id}', 'MappingRuoloController@delete');

    // USERS
    Route::get('users/roles','UserController@roles');
    Route::get('users/permissions','UserController@permissions');
    Route::resource('users', 'UserController');
    Route::post('users/query', 'UserController@query'); 

    // ROLES
    Route::get('roles', 'RoleController@index');
    Route::get('roles/{id}', 'RoleController@show');
    Route::post('roles/query', 'RoleController@query'); 
    Route::post('roles', 'RoleController@store');
    Route::put('roles/{id}', 'RoleController@update');
    Route::delete('roles/{id}', 'RoleController@delete');

    // PERMISSIONS
    Route::get('permissions', 'PermissionController@index');
    Route::get('permissions/{id}', 'PermissionController@show');
    Route::post('permissions/query', 'PermissionController@query'); 
    Route::post('permissions', 'PermissionController@store');
    Route::put('permissions/{id}', 'PermissionController@update');
    Route::delete('permissions/{id}', 'PermissionController@delete');
  
});

Route::group(['middleware' => ['cors','auth:api','log'], 'namespace'=>'Api\V1'], function() {
 
    //mail
    Route::post('mail/sendMail', 'NotificationController@sendMail'); 

    // BANDO
    Route::get('bandi/{id}', 'BandoController@show');
    Route::post('bandi/query', 'BandoController@query'); 
    Route::post('bandi/querycommissione', 'BandoController@querycommissione'); 
    Route::post('bandi', 'BandoController@store');
    Route::put('bandi/{id}', 'BandoController@update');
    Route::delete('bandi/{id}', 'BandoController@delete');
    Route::post('bandi/export','BandoController@export'); 
    Route::post('bandi/sendinfoemail','BandoController@sendInfoEmail');
    //CANDIDATI
    Route::post('candidati/query', 'CandidatoController@query');
    Route::post('candidati/export','CandidatoController@export');

    // DOMANDA
    Route::get('domande/intestazionebando/{id}', 'DomandaController@intestazioneBando');
    Route::get('domande/{id}', 'DomandaController@show');
    Route::post('domande/query', 'DomandaController@query'); 
    Route::post('domande/querycommissione', 'DomandaController@querycommissione'); 
    Route::post('domande', 'DomandaController@store');
    Route::put('domande/{id}', 'DomandaController@update');
    Route::get('domande/previewdomanda/{id}','DomandaController@previewDomanda');
    Route::get('domande/downloaddomanda/{id}','DomandaController@downloadDomanda');
    Route::post('domande/terminainoltra','DomandaController@terminaInoltra');
    Route::post('domande/export','DomandaController@export'); 
    //Route::delete('domande/{id}', 'DomandaController@delete');

    
    //logattivita
    Route::post('logattivita/query','LogActivityController@query');

    // PersonaInterna
    Route::post('personeinterne/query','PersonaInternaController@query');

    // StrutturaInterna
    Route::post('struttureinterne/query','StrutturaInternaController@query');
    Route::get('struttureinterne/{id}','StrutturaInternaController@getminimal');

    // StrutturaEsterna
    Route::post('struttureesterne/query','StrutturaEsternaController@query');
    Route::get('struttureesterne/{id}','StrutturaEsternaController@getminimal');

    // Documenti
    Route::post('documenti/query','DocumentoController@query');
    Route::get('documenti/{id}','DocumentoController@getminimal');
  
    //unità organizzativa
    Route::post('unitaorganizzative/query','UnitaOrganizzativaController@query');
    Route::get('unitaorganizzative/{id}','UnitaOrganizzativaController@getminimal');

    //allegati
    Route::get('attachments/download/{id}','AttachmentController@download');
    Route::delete('attachments/{id}','AttachmentController@deletefile');

    //mapping uffici
    Route::get('mappinguffici', 'MappingUfficioController@index');
    Route::get('mappinguffici/{id}', 'MappingUfficioController@show');
    Route::post('mappinguffici/query', 'MappingUfficioController@query'); 
    Route::post('mappinguffici', 'MappingUfficioController@store');
    Route::put('mappinguffici/{id}', 'MappingUfficioController@update');
    Route::delete('mappinguffici/{id}', 'MappingUfficioController@delete');


});



