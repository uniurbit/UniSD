<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\User;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = User::all()->count();
        if (!($user == 1)) {
            //hasPermissionTo('Administer roles & permissions')
            if (!Auth::user()->hasRole('admin')) //If user does //not have this permission
            {
                abort('401');
            }
        }

        return $next($request);
    }
}