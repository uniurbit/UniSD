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
import { CandidatoService } from 'src/app/services/candidato.service';
import { MyFilterhourPipe } from './filterhour.pipe';

@Component({
  selector: 'app-candidati',
  templateUrl: '../../shared/base-component/base-research.component.html',
  styles: []
})
export class CandidatiComponent extends BaseResearchComponent {
  enabledExport = true;
  fieldsRow: FormlyFieldConfig[] = [

    {
      key: 'bando.id',
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
      key: 'd.stato',
      type: 'select',
      templateOptions: {
        label: 'Stato domanda',
        required: true,
        options: [
          { value: '[null]', label: 'Non compilata' },
          { value: 0, label: 'Bozza' },
          { value: 1, label: 'Inoltrata' },
          { value: 2, label: 'Ultimo inoltro' },
        ]
      }
    },
    {
      key: 'sessione',
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
      key: 'descrizione',
      type: 'string',
      templateOptions: {
        label: 'Descrizione bando',
        required: true,

      }
    },
    {
      key: 'name',
      type: 'string',
      templateOptions: {
        label: 'Nominativo docente (nome cognome)',
        required: true,
      }
    },
    {
      key: 'cognome',
      type: 'string',
      templateOptions: {
        label: 'Cognome',
        required: true,
      }
    },
    {
      key: 'nome',
      type: 'string',
      templateOptions: {
        label: 'Nome',
        required: true,
      }
    },
    {
      key: 'candidati.email',
      type: 'string',
      templateOptions: {
        label: 'Email',
        required: true,
      }
    },
  ]

  translate: MyTranslatePipe;
  filterhour: MyFilterhourPipe;
  constructor(protected service: CandidatoService, router: Router, route: ActivatedRoute, translateService: TranslateService) {
    super(router, route);
    this.translate = new MyTranslatePipe(translateService);
    this.filterhour = new MyFilterhourPipe();
    //DEVONO ESSERE MOSTRATI SOLO I BANDI CHE HA COMPILATO L'UTENTE
    this.routeAbsolutePath = 'home/domanda/view';
    this.enableNew = false;
    this.enabledExport=true;
    this.prefix = 'candidati';

    this.initRule();

    if (this.rules == null){
      this.rules = [
        {field: "bando.id", operator: "=", value: '', fixcondition: true},  
      ];
    }

 
  }


  protected getRules(model) {
    if (model.rules) {
      let rulestmp = JSON.parse(JSON.stringify(model.rules)) as (Array<any>);
      let ruleState = rulestmp.filter(x => x.field === 'bando.id'|| x.field === 'd.stato' || x.field === 'candidati.email');      
      if (ruleState) {
        ruleState.forEach(element => {
          element.type = "alias";
          if (element.field == 'd.stato' && element.value == 2){
            element.value = 1;
            if (element.operator === '=') {
              rulestmp  = rulestmp.concat(  { field: "flag_ultima", operator: "=", value: 1, type: "" },);
            } else {
              rulestmp  = rulestmp.concat(  { field: "flag_ultima", operator: "=", value: 0, type: "" },);
            }
          }

        });
      }      
      return rulestmp;
    }
    return model.rules;
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
        label: 'Domande candidati',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '#', prop: 'email', width: 160, maxWidth: 180 },
          { name: 'Nome', prop: 'nome', width: 120, maxWidth: 130 },
          { name: 'Cognome', prop: 'cognome', width: 120, maxWidth: 130 },
          { name: 'Titolo bando', prop: 'descrizione', width: 300 },
          { name: 'Sessione', prop: 'sessione', pipe: this.translate, with: 120, maxWidth: 130 },
          { name: 'Periodo', prop: 'periodo_riferimento', width: 100, maxWidth: 120 },
          { name: 'Stato domanda', prop: 'current_state', pipe: this.translate, width: 150, maxWidth: 150 },
          { name: 'Data inoltro', prop: 'data_data_inoltro', width: 100, maxWidth: 130 },
          { name: 'Ora inoltro', prop: 'ora_inoltro', pipe: this.filterhour, width: 100, maxWidth: 130 },
          { name: 'Num. protocollo', prop: 'num_prot', width: 100, maxWidth: 130 },
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

  onDblclickRow(event) {
    this.setStorageResult();
    // , {relativeTo: this.route}       
    if (event.type === 'dblclick') {
      if (event.row.domandaid) {
        this.router.navigate([this.routeAbsolutePath, event.row.domandaid]);
      }
    }
  }


}
