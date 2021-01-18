<?php
/**
 * uniurb/unidem package configuration file. 
 */
return [

    /**
     * Datepicker configuration:
     */
    'date_format'        => 'd-m-Y',
    'date_format_jquery' => 'dd-mm-yyyy',
    'time_format'        => 'H:i:s',
    'time_format_jquery' => 'HH:mm:ss',

    'datetime_format' => 'd-m-Y H:i',
    'timezone' => 'Europe/Rome',

    'date_format_domanda' => 'd/m/Y',

    /**
     * Quickadmin settings
     */
    // Default route
    'route'              => 'https://unidemdev.uniurb.it/unidem/uniconv/',  
    
    'client_url' => env('CLIENT_URL', 'https://unidemdev.uniurb.it/unidem/uniconv/uniconvclient'),   

    // Default role to access users
    //'defaultRole'        => ''
     
    'unitaSuperAdmin' => ['005400','004210'],
    'unitaAdmin' => explode(',',env('UFF_ADMIN','005479')),    

    'administrator_email' =>  explode(',',env('ADMINISTRATOR_EMAIL', 'enrico.oliva@uniurb.it')),   
         
    'ufficio_amministrazione' => 'amministrazione.reclutamento.pdoc@uniurb.it',

    'classificazione' => '07/1',
    'oggetto' => 'Procedura scatti stipendiali',
    'rpa_nome_ufficio' => 'Ufficio Amministrazione e Reclutamento Personale Docente',
    'rpa_nome_resp' => 'Antonelli Gianluca', //cognome nome
];