<?php

namespace App\Service;
use Request;
use App\LogActivity as LogActivityModel;
use App\User;
use Auth;

class LogActivityService
{


    public static function addToLog($subject, $content = null)
    {

        if ($content == null){
            $content = Request::getContent();
            $content = (strlen($content) > 500) ? substr($content,0,500) : $content;
        }

    	$log = [];
    	$log['subject'] = $subject;
    	$log['url'] = Request::fullUrl();
    	$log['method'] = Request::method();
    	$log['ip'] = Request::ip();
        $log['agent'] = Request::header('user-agent');
        $log['request'] = utf8_encode($content);
    	$log['user_id'] = Auth::user() ? Auth::user()->id : -1;
    	LogActivityModel::create($log);
    }


    public static function logActivityLists()
    {
    	return LogActivityModel::latest()->get();
    }


}