import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseResearchComponent } from 'src/app/shared';
import { BandoService } from 'src/app/services/bando.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { DatePipe } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-bando-list-domanda',
  templateUrl: '../../shared/base-component/base-research.component.html',
  styles: []
})

export class BandoListDomandaComponent extends BaseResearchComponent {
  @ViewChild('seleziona') seleziona: TemplateRef<any>;

  fieldsRow: FormlyFieldConfig[] = [
    {
      key: 'sessione',
      type: 'select',
      hideExpression: false,
      templateOptions: {
        label: 'Sessione',
        options: [
          {value: 'prima', label: 'Prima sessione'},
          {value: 'seconda', label: 'Seconda sessione'},
        ]
      }
    },
    {
      key: 'descrizione',
      type: 'input',
      templateOptions: {
        label: 'Descrizione',
        required: true,
      }
    },
  ];

  isLoading = false;
  constructor(protected service: BandoService, router: Router, route: ActivatedRoute, private datePipe: DatePipe,) {
    super(router, route);
    this.enableNew = false;
    //DEVONO ESSERE MOSTRATI SOLO I BANDI A CUI L'UTENTE è AMMESSO
    //bandoservice filtra per condiati 
    this.routeAbsolutePath = 'home/bando'

  }

  protected getRules(model) {
    if (model.rules) {
      let rulestmp = JSON.parse(JSON.stringify(model.rules)) as (Array<any>);
      const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy'); 
      rulestmp  = rulestmp.concat([        
        { field: "data_inizio", operator: "<=", value: today, type: "date" },
        { field: "data_fine",  operator: ">=", value: today, type: "date" },  
        { field: "stato",  operator: "=", value: 'abilitato', },          
      ]);
       
      return rulestmp;
    }
    return model.rules;
  }

  ngOnInit() {
    this.resultMetadata = [{
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Bandi',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPage(pageInfo),
        columns: [
          { name: '#', prop: 'id', width: 80, maxWidth: 100 },
          { name: 'Titolo bando', prop: 'descrizione', width: 300, maxWidth: 400 },
          { name: 'Data inizio', prop: 'data_inizio', width: 100, maxWidth: 150 },
          { name: 'Data fine', prop: 'data_fine', width: 100, maxWidth: 150 },
          { name: 'Periodo', prop: 'periodo_riferimento', width: 50, maxWidth: 100 },
          { name: 'Stato', prop: 'current_state', width: 50, maxWidth: 100 },
          { name: '', prop: 'id', width: 150, maxWidth: 150, cellTemplate: this.seleziona },
        ]
      },
      fieldArray: {
        fieldGroup: [],
      }
    }];
  }

  onDblclickRow($event){

  }

  rowSelection(row) {
    this.router.navigate(['home/domanda/'+row.id, { act: 'new'}]);
  }

}
