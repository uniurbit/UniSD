import { Component, OnInit } from '@angular/core';
import { DomandaService } from 'src/app/services/domanda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { encode, decode } from 'base64-arraybuffer';

@Component({
  selector: 'app-domanda-view',
  templateUrl: './domanda-view.component.html',
  styles: []
})
export class DomandaViewComponent implements OnInit {

  isLoading = false;
  model: any = null;
  modelIntestazione: any = null;

  constructor(protected service: DomandaService, protected route: ActivatedRoute, protected router: Router, protected location: Location,
    protected translateService: TranslateService,
    protected confirmationDialogService: ConfirmationDialogService) { 
    
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.clearMessage();
   
        //entra con id della domanda
        if (params.has('id')) {
          this.isLoading = true;
          //params['id'] coneitene il parametro letto dalla url, può contenere un id o anche la parola new
          this.service.getById(params.get('id')).subscribe(
            result => {
              this.isLoading = false;
              
              this.model = result;

              try {
                this.model.contenuto = JSON.parse(result.contenuto);
              } catch (e) {
                var stringified = JSON.stringify(result.contenuto);
                this.model.contenuto = JSON.parse(stringified);
              }

              let bando = result.bando;
              bando.user = result.user;
              bando.domanda = {
                num_prot: result.num_prot
              };
              this.modelIntestazione = bando; 
              
              //se per questo utente e questo bando esiste già una domanda
              //reindirizzare alla pagina view
            },
            error => {
              this.isLoading = false;
            }
          );
        }
    });
  }

  checkFalse(value: boolean) {
    if (!value) {
      return 'di non aver';
    }
    return 'di aver';
  }

  update(){
    this.router.navigate(['home/domanda/'+this.model.id, { act: 'upd'}]);
  }

  termina(idins: number) {
    let message: string =
      `<p align="justify">${this.model.user.sesso == 'M' ? 'Gent.mo' : this.model.user.sesso == 'F' ? 'Gent.ma' : 'Gentile' } <strong>${this.model.user.nome} ${this.model.user.cognome}</strong>,<br>
      premendo sul tasto TERMINA E INOLTRA, la domanda verrà protocollata e inoltrata agli uffici competenti.<br>
      `;

    this.confirmationDialogService.confirm('Conferma termina e inoltra', null, 'Termina e inoltra', 'Annulla', 'lg', message)
    .then((confirmed) => {
          if (confirmed) {
            this.isLoading = true;
            this.service.terminaInoltra(this.model).subscribe(
              response => {
                this.isLoading = false;
                if (response['success']) {
                  const result = response['data'];
                  this.service.messageService.info('Procedura di termina e inoltra completata con successo');
                  this.modelIntestazione.domanda = {
                    num_prot: result.num_prot,
                    stato: result.stato,
                  };
                  this.model.attachments = result.attachments;
                  this.model.stato = result.stato;
                  this.model.data_inoltro = result.data_inoltro;
                  this.model.flag_reinoltro = result.flag_reinoltro;
                  //this.model = result;
                } else {
                  this.service.messageService.error(response['message']);
                }
              },
              error => {
                this.service.messageService.error(error);
                this.isLoading =false;
              }
            );
            
        }
      }
    );
  }

  downloadDomanda() {
    if (this.isInoltrata()) {
      const attach = this.model['attachments'].find(x => x.attachmenttype_codice === 'DOMANDA');
      if (attach){
        this.service.downloadDomanda(this.model.id).subscribe(file => {
          if (file.filevalue) {
            const blob = new Blob([decode(file.filevalue)]);
            saveAs(blob, file.filename);
          }
        },
          e => { console.log(e); }
        );
      }
    }
  }

  previewdomanda() {
    this.isLoading = true;
    this.service.previewDomanda(this.model.id).subscribe(file => {
      this.isLoading = false;
      if (file.filevalue) {

        const blob = new Blob([decode(file.filevalue)], { type: 'application/pdf' });
      
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
        // saveAs(blob, file.filename);
        // Object.assign(document.createElement('a'), { target: '_blank', title: file.filename, href: URL.createObjectURL(blob)}).click();
      }
    },
    e => {
      this.isLoading = false;
      console.log(e);
    }
    );
  }

  download(id) {
    this.service.download(id).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );

  }

  isInoltrata(){
    return this.model.stato ==1
  }

  //2016-2018
  annoAccademico(num) {
    //if (this.modelIntestazione.sessione == "prima"){
      return ((this.modelIntestazione.periodo_inizio - 1) + (num-1))+"/" + (this.modelIntestazione.periodo_inizio + (num-1));
    //}
    //return (this.modelIntestazione.periodo_inizio  + (num-1)) + "/" + (this.modelIntestazione.periodo_inizio + 1 + (num-1));
  }

  anno(num){
    return this.modelIntestazione.periodo_inizio + (num-1);
  }

  onNuovaIstanza(){
    this.router.navigate(['home/domanda/'+this.model.bando_id, { act: 'newistance'}],{
      state: { 
        entity: this.model
      }
    });
  }

  isVisibleNuovaIstanza(){
    return this.model && this.model.stato == 1 && this.modelIntestazione && this.modelIntestazione.current_state.toUpperCase() == 'APERTO';
  }

  numPeriodo(){
    return this.modelIntestazione.periodo_fine - this.modelIntestazione.periodo_inizio
  }

  triennio() {
    if (this.modelIntestazione){
      return this.modelIntestazione.template_codice=='SDART6';
    }
    return false;
  }

  numPeriodoTitle(){
    if (this.triennio())
      return this.translateService.instant('periodo_2');
    else 
      return this.translateService.instant('periodo_1');
  }


  isTerminabile(){
    return this.model && this.model.stato === 0 && this.modelIntestazione.current_state.toUpperCase() == 'APERTO';
  }
 
}
