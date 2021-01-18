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

// App v1 API
Route::group([
    'middleware' => ['api', 'api.version:1'],  
    'prefix'     => 'v1',
  ], function ($router) {
    require base_path('routes/app_api.v1.php');
});
  
Route::get('/loginSaml', function(Request $request){
    
    if(\Auth::guest())
    {       
  
        if (\App::environment('local')) {
            if (\Request::ip() == "192.168.5.135" || \Request::ip() == "192.168.5.137" || \Request::ip() == "127.0.0.1" ) {
                return  \Saml2::login(config('unidem.client_url').'home');            
            } else {
                return  abort(404);
            }
        }
        return  \Saml2::login(config('unidem.client_url').'home');                             
        
    }
});

   
   
Route::group([
    'middleware' => ['api','cors'],
    'prefix' => 'auth',
    'namespace'=>'Api'
], function ($router) {   
    Route::post('refreshtoken', 'AuthController@refresh');
    Route::get('logout', 'AuthController@logout');   
});

