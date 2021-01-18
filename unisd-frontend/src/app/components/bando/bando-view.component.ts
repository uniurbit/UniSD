import { Component, OnInit } from '@angular/core';
import { BaseEntityComponent } from 'src/app/shared';
import { BandoService, InfraRequest } from 'src/app/services/bando.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, JsonPipe } from '@angular/common';
import { encode, decode } from 'base64-arraybuffer';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bando-view',
  templateUrl: './bando-view.component.html',
  styles: []
})
export class BandoViewComponent extends BaseEntityComponent  {

  gestioneinformazioni: boolean = false;
  model2: any = {};

  fields2: FormlyFieldConfig[] = [
    {
      key: 'gruppo',
      type: 'select',
      templateOptions: {
        required: true,
        label: 'Inviare comunicazione a',
        options: [
          {value: 'CANDIDATI', label: 'Candidati'},
          {value: 'COMMISSIONE', label: 'Commissione'},
        ]
      },
    },
    {
      key: 'oggetto',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'Oggetto',
        maxLength: 190
      },
    },
    // motivazione
    {
      key: 'corpo_testo',
      type: 'textarea',
      
      templateOptions: {
        required: true,
        label: 'Testo della comunicazione',
        rows: 5,
      },
    },
    {
      key: 'allegato',
      type: 'checkbox',
      defaultValue: false,
      templateOptions: {
        indeterminate: false,
        label: 'Allega i documenti collegati al bando',
      },
    }
  ];
    

  constructor(protected service: BandoService, router: Router, route: ActivatedRoute, protected location: Location, protected confirmationDialogService: ConfirmationDialogService,) {
    super(route, router, location);
   
  }

  update(){
    this.router.navigate(['home/bandi/'+this.model.id, { act: 'upd'}]);
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

  toggleGestioneInformazioni() {
    this.gestioneinformazioni = !this.gestioneinformazioni;
  }

  sendInfoEmail() {
    // tslint:disable-next-line:max-line-length
    this.confirmationDialogService.confirm('Conferma', 'Vuoi procedere con l\'invio della comunicazione?' )
    .then((confirmed) => {
      if (confirmed) {
        this.isLoading = true;
        const data: InfraRequest<any> = {
          bando_id: this.model.id,
          entity: this.model2
        };
        this.service.sendInfoEmail(data).subscribe(
          response => {
            if (response.success) {
              this.model.comunicazioni = this.model.comunicazioni || [];
              this.model.comunicazioni.push(response.data);
              this.gestioneinformazioni = false;
              this.options.resetModel();
              this.service.messageService.info(response.message);
            } else {
              this.service.messageService.error(response.message);
            }
          },
          (error) => this.isLoading = false,
          () => this.isLoading = false
        );
      }
    });
  }

  public currentCom;
  public selectCom(event: any, com: any) {
    this.currentCom= com;
  }
  public currentRemove(){
    this.currentCom=null;
  }

  public getCount(str){
    return str.split(/\r\n|\r|\n/).length
  }


}
