import { Component, OnInit } from '@angular/core';
import { DomandaService } from 'src/app/services/domanda.service';
import { BaseResearchComponent } from 'src/app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BandoService } from 'src/app/services/bando.service';
import { tap, map } from 'rxjs/operators';
import { defer } from 'rxjs';
import { MyFilterhourPipe } from '../bando/filterhour.pipe';

@Component({
  selector: 'app-domande',
  templateUrl: '../../shared/base-component/base-research.component.html',
  styles: []
})
export class DomandeComponent extends BaseResearchComponent {
  enabledExport = true;
  fieldsRow: FormlyFieldConfig[] = [

    {
      key: 'bando_id',
      type: 'select',
      templateOptions: {
        label: 'Scegli bando',
        options: defer(() => {
          //this.isLoading = true;
          return this.service.listabandi({
            limit: 500,
            rules: []
          }).pipe(
            map(x => {
             // this.isLoading = false;
              return x.data.map(el => {
                return {
                  value: el.id,
                  label: el.descrizione + ' - ' + this.translate.transform(el.sessione) + ' - ' + el.data_fine.split('-')[2]
                };
              })
            }))
        }),
      }
    },
    {
      key: 'bando.sessione',
      type: 'select',
      templateOptions: {
        label: 'Sessione bando',
        required: true,
        options: [
          { value: 'prima', label: 'Prima sessione' },
          { value: 'seconda', label: 'Seconda sessione' },
        ]
      }
    },
    {
      key: 'bando.descrizione',
      type: 'string',
      templateOptions: {
        label: 'Descrizione bando',
        required: true,

      }
    },
    {
      key: 'stato',
      type: 'select',
      templateOptions: {
        label: 'Stato domanda',
        required: true,
        options: [
          { value: 0, label: 'Bozza' },
          { value: 1, label: 'Inoltrata' },
        ]
      }
    },
    {
      key: 'user.name',
      type: 'string',
      templateOptions: {
        label: 'Nominativo docente (nome cognome)',
        required: true,
      }
    },
    {
      key: 'user.cognome',
      type: 'string',
      templateOptions: {
        label: 'Cognome',
        required: true,
      }
    },
    {
      key: 'user.name',
      type: 'string',
      templateOptions: {
        label: 'Nome',
        required: true,
      }
    },
  ]

  translate: MyTranslatePipe;
  filterhour: MyFilterhourPipe;
  constructor(protected service: DomandaService, router: Router, route: ActivatedRoute, translateService: TranslateService) {
    super(router, route);
    this.translate = new MyTranslatePipe(translateService);
    this.filterhour = new MyFilterhourPipe();
    //DEVONO ESSERE MOSTRATI SOLO I BANDI CHE HA COMPILATO L'UTENTE
    this.routeAbsolutePath = 'home/domanda/view';
    this.enableNew = false;
    this.prefix = 'domande';
    this.initRule();
  }

  ngOnInit() {

    let page = new Page(25);
    let result = null;

    if (this.getStorageResult()) {
      result = JSON.parse(this.getStorageResult());
      this.init = true;
      page.totalElements = result.total; // data.to;
      page.pageNumber = result.current_page - 1;
      page.size = result.per_page;
    }

    this.resultMetadata = [{
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Domande',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '#', prop: 'id', width: 80, maxWidth: 80 },
          { name: 'Nome', prop: 'user.nome', width: 120, maxWidth: 130 },
          { name: 'Cognome', prop: 'user.cognome', width: 120, maxWidth: 130 },
          { name: 'Titolo bando', prop: 'bando.descrizione', width: 300 },
          { name: 'Sessione', prop: 'bando.sessione', pipe: this.translate, with: 100, maxWidth: 100 },
          { name: 'Data fine bando', prop: 'bando.data_fine', width: 100, maxWidth: 130 },
          { name: 'Periodo', prop: 'bando.periodo_riferimento', width: 50, maxWidth: 100 },
          { name: 'Stato', prop: 'current_state', pipe: this.translate, width: 50, maxWidth: 100 },
          { name: 'Data inoltro', prop: 'data_data_inoltro', width: 100, maxWidth: 130 },
          { name: 'Ora inoltro', prop: 'ora_inoltro', pipe: this.filterhour, width: 100, maxWidth: 130 },
        ]
      },
      fieldArray: {
        fieldGroup: [],
      }
    }];

    if (result) {
      this.setResult(result);
    }

  }




}
