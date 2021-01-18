import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseResearchComponent } from 'src/app/shared';
import { BandoService } from 'src/app/services/bando.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';

@Component({
  selector: 'app-bando-list',
  templateUrl: '../../shared/base-component/base-research.component.html',
  styles: []
})

//componente per ricerca bandi e apre bando per modifica 
export class BandoListComponent extends BaseResearchComponent {
  enabledExport = true;
  isLoading = false;

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
    {
      key: 'stato',
      type: 'select',
      templateOptions: {
        label: 'Stato',
        required: true,
        options: [
          {value: 'abilitato', label: 'Abilitato'},
          {value: 'disabilitato', label: 'Disabilitato'},
        ]
      }
    },
  
    
  ];

  translate: MyTranslatePipe;

  constructor(protected service: BandoService, router: Router, route: ActivatedRoute, translateService: TranslateService ) {
    super(router, route);
    this.translate = new MyTranslatePipe(translateService);
    this.enableNew = false;
    this.routeAbsolutePath = 'home/bandi/view';

  }

  ngOnInit() {
    this.resultMetadata = [{
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Scegli bando',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPage(pageInfo),
        columns: [
          { name: '#', prop: 'id', width: 50, maxWidth: 80 },
          { name: 'Titolo bando', prop: 'descrizione' },
          { name: 'Sessione', prop: 'sessione', pipe: this.translate, with: 120, maxWidth: 150 },
          { name: 'Data inizio', prop: 'data_inizio', width: 100, maxWidth: 130 },
          { name: 'Data fine', prop: 'data_fine', width: 100, maxWidth: 130 },
          { name: 'Periodo', prop: 'periodo_riferimento', width: 50, maxWidth: 100 },
          { name: 'Modalità', prop: 'stato', width: 50, maxWidth: 100 },
          { name: 'Stato', prop: 'current_state', width: 50, maxWidth: 100 },
        ]
      },
      fieldArray: {
        fieldGroup: [],
      }
    }];
  }

}
