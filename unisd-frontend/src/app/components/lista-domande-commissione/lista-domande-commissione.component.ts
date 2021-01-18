

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
import { DatePipe } from '@angular/common';
import { DomandaCommissioneService } from 'src/app/services/domandacommissione.service';

@Component({
  selector: 'app-lista-domande-commissione',
  templateUrl: '../../shared/base-component/base-research.component.html',
  styles: []
})
export class ListaDomandeCommissioneComponent extends BaseResearchComponent {

  fieldsRow: FormlyFieldConfig[] = [

    {
      key: 'bando_id',
      type: 'select',
      templateOptions: {
        label: 'Scegli bando',
        options: defer(() => {
          //this.isLoading = true;
          return this.service.listabandicommissione({
            limit: 500,
            rules: [
              { field: "data_fine",  operator: "<", value: this.datePipe.transform(Date.now(), 'dd-MM-yyyy'), type: "date" },
            ]
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
      defaultValue: 1,
      templateOptions: {
        label: 'Stato domanda',
        required: true,
        disabled: true,
        options: [
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
  constructor(protected service: DomandaCommissioneService, private datePipe: DatePipe, router: Router, route: ActivatedRoute, translateService: TranslateService) {
    super(router, route);
    this.translate = new MyTranslatePipe(translateService);
    //DEVONO ESSERE MOSTRATI SOLO I BANDI CHE HA COMPILATO L'UTENTE
    this.routeAbsolutePath = 'home/domanda/view';
    this.enableNew = false;
    this.prefix = 'domandecommissione';
    
    this.initRule();
    
    if (this.rules == null){
      this.rules = [
        {field: "stato", operator: "=", value: 1, fixcondition: true},
        {field: "bando_id", operator: "=", value: null, fixcondition: true},
      ];
    }
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
        label: 'Lista domande',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        headerHeight: 50,
        footerHeight: 50,
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '#', prop: 'id', width: 80, maxWidth: 80 },
          { name: 'Nome', prop: 'user.nome', width: 130, maxWidth: 130 },
          { name: 'Cognome', prop: 'user.cognome', width: 130, maxWidth: 130 },
          { name: 'Titolo bando', prop: 'bando.descrizione', width: 300 },
          { name: 'Sessione', prop: 'bando.sessione', pipe: this.translate, with: 100, maxWidth: 100 },
          { name: 'Data inizio', prop: 'bando.data_inizio', width: 100, maxWidth: 130 },
          { name: 'Data fine', prop: 'bando.data_fine', width: 100, maxWidth: 130 },
          { name: 'Periodo', prop: 'bando.periodo_riferimento', width: 50, maxWidth: 100 },
          { name: 'Stato', prop: 'current_state', width: 50, maxWidth: 100 },
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
