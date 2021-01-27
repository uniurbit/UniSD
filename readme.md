UniSD è una applicazione web per la gestione delle domande per gli scatti stipendiali dei docenti. L'applicazione è basata su Web API e sviluppata sul framework Laravel per la parte backend, Angular per la parte frontend e Shibboleth come sistema di autenticazione.
-------------------------------

## Funzionalità Applicative

- 🔥 Gestione degli avvisi 
    - Data inizio e data fine della procedura
    - Documentazione allegata all'avviso
    - Fascicolazione domande
    - Elenco dei candidati
    - Elenco membri della commissione
    - Perido di riferimento della procedura
    - Modello domanda ai sensi dell'art. 6, comma 14, della legge 240/2010
    - Modello domanda ai sensi dell'art. 1, comma 629, della legge 27 dicembre 2017, n. 205 ai sensi dell'art. 6, comma 14, della legge 240/2010
- 🔥 Gestione domande
    - Inserimento attività didattica, di richerca e gestionale
    - Modifica della domanda non inoltrata
    - Protocollazione della domanda inoltrata    
- 🔥 Dashboard commissione 
- 🔥 Dashboard docente 
    - Elenco delle procedure per cui può presentare domanda
    - Elenco delle domande presentate

## Caratteristiche sistema

- 🔥 Applicazione web con architettura basata su Web API
- ⚡️ Supporto per il SSO con Shibbolet
- ⚡️ Integrazione per la lettura dati da Ugov
    - lettura afferenza organizzativa
- ⚡️ Integrazione con Titulus 
- 📝 Sistema multi utente e multi ruolo
- 📝 Generazione di pdf basato su [wkhtmltopdf](https://github.com/barryvdh/laravel-snappy)
- 😍 Tema Boostrap 
- 💪 Costruito su 
    - [Laravel](https://laravel.com/) 
    - [Angular](https://angular.io/)
    - [Dynamic forms in Angular](https://formly.dev/)


## Creazione di una applicazione

1) Fare un fork del repository 

2) Eseguire il clone del progetto 

## Configurazione UniSD-backend

1) Entrare nella cartella `cd .\unisd-backend\`

2) Creare un file di configurazione .env (copiare, rinominare e modificare il file .env.exmaple inserendo il nome dell'applicazione, 
il database di riferimento ...)

3) Eseguire `composer install` per l'istallazione dei package

4) Eseguire `php artisan migrate:fresh --seed` 

## Configurazione UniSD-frontend

1) Entrare nella cartella `cd .\unisd-frontend\`

2) Eseguire `npm install`
   
## Configurazione UniSD-mockipd

1) Entrare nella cartella cd `cd .\unisd-mock-idp\`

2) Eseguire  `npm install fake-sso-idp`

3) Il mock idp è configurato con un utente a cui è associato il ruolo SUPER-ADMIN


## Lancio dell'applicazione

1) Aprire tre terminal

2) Lancio dei servizi di backend 

```   
    cd .\unisd-backen\
    php artisan serve --port 80
``` 

3) Lancio del frontend

```
    cd .\unisd-frontend\
    ng serve
```

4) Lancio del mock idp

```
    cd .\unisd-mock-idp\  
    node start.js
``` 

Aprire il broswer all'indirizzo  `http://localhost:4200/`










Happy coding! 

