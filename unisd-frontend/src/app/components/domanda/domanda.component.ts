import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BandoService } from 'src/app/services/bando.service';
import { Location } from '@angular/common';
import { DomandaService } from 'src/app/services/domanda.service';
import { encode, decode } from 'base64-arraybuffer';

@Component({
  selector: 'app-domanda',
  templateUrl: './domanda.component.html',
  styles: []
})



export class DomandaComponent extends BaseEntityComponent {

  fields_didattica: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_didattica',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: true,
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_didattica === false || model.flag_didattica === 0) {
                return 'DI NON AVER ' + this.translateService.instant('d1_label_off');
              } else {
                return 'DI AVER ' + this.translateService.instant('d1_label_on', {periodo: this.numPeriodoTitle()});
              }
            }
          }
        },
      ]
    },
 
    //didattica
    {
      key: "didattica",
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              type: 'checkbox',
              key: 'flag_didattica_conferma',
              className: 'custom-switch pl-4 pr-2 pt-1',
              defaultValue: true,
              expressionProperties: {
                'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
                  if (model.flag_didattica_conferma === false || model.flag_didattica_conferma === 0) {
                    return 'DI NON CONFERMARE ' + this.translateService.instant('didattica_conferma');
                  } else {
                    return 'DI CONFERMARE ' + this.translateService.instant('didattica_conferma'); //, {periodo: this.numPeriodoTitle()}
                  }
                }
              }
            },
          ]
        },
        {
          template: '<div class="mb-1">Con riferimento all\'attività didattica svolta negli anni accademici:</div>'
        },
        {
          type: 'textarea', //textarea //wysiwyg
          key: 'descr_1',
          templateOptions: {
            label: 'c_label6',
            rows: 5,
            required: true,
            description: "con riferimento all'attività didattica svolta nell'anno accademico"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.annoAccademico(1);
            }
          }
        },
        {
          type: 'textarea',
          key: 'descr_2',
          templateOptions: {
            label: 'c_label7',
            rows: 5,
            required: true,
            description: "con riferimento all'attività didattica svolta nell'anno accademico"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.annoAccademico(2);
            }
          }
        },
        {
          type: 'textarea',
          key: 'descr_3',
          templateOptions: {
            label: 'c_label8',
            rows: 5,
            required: true,
            description: "con riferimento all'attività didattica svolta nell'anno accademico"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.annoAccademico(3);
            }
          },
          hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
            return !this.triennio();
         },
        },
      ],
      hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
        if (field.parent.model.flag_didattica === 0 || field.parent.model.flag_didattica === false) {
          return true;
        }
        return false;
      },
    },
    {
      template: "<hr>"
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_aspettativa',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_aspettativa === false || model.flag_aspettativa === 0) {
                return 'DI NON AVER';
              } else {
                return 'DI AVERE';
              }
            }
          }
        },
        {
          template: this.translateService.instant('d1_label1',{periodo: this.numPeriodoTitle()}),
          className: 'col-auto  pt-1'
        }
      ]
    },
  ];

  fields_ricerca: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_ricerca',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: true,
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_ricerca === false || model.flag_ricerca === 0) {
                return 'DI NON AVER ' + this.translateService.instant('d1_label2',{periodo: this.numPeriodoTitle()});
              } else {
                return 'DI AVER ' + this.translateService.instant('d1_label2',{periodo: this.numPeriodoTitle()});
              }
            }
          }
        },
      ]
    },
    {
      key: "ricerca",
      fieldGroup: [
        {
          template: '<div class="mb-1">Con riferimento all\'attività di ricerca svolta negli anni solari:</div>'
        },
        {
          type: 'textarea',
          key: 'descr_1',
          templateOptions: {
            label: 'c_label6',
            rows: 5,
            required: true,
            description: "con riferimento all'attività di ricerca svolta nell'anno solare"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.anno(1);
            }
          }
        },
        {
          type: 'textarea',
          key: 'descr_2',
          templateOptions: {
            label: 'c_label7',
            rows: 5,
            required: true,
            description: "con riferimento all'attività di ricerca svolta nell'anno solare"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.anno(2);
            }
          }
        },
        {
          type: 'textarea',
          key: 'descr_3',
          templateOptions: {
            label: 'c_label8',
            rows: 5,
            required: true,
            description: "con riferimento all'attività di ricerca svolta nell'anno solare"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.anno(3);
            }
          },
          hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
             return !this.triennio();
          },
        },
      ],
      hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
        if (field.parent.model.flag_ricerca === 0 || field.parent.model.flag_ricerca === false) {
          return true;
        }
        return false;
      },
    },
  ]

  fields_gestionale: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_gestionale',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_gestionale === false || model.flag_gestionale === 0) {
                return 'DI NON AVER ' + this.translateService.instant('d1_label3',{periodo: this.numPeriodoTitle()});
              } else {
                return 'DI AVER  ' + this.translateService.instant('d1_label3',{periodo: this.numPeriodoTitle()});
              }
            }
          }
        },
      ]
    },
    {
      key: "gestionale",
      fieldGroup: [
        {
          template: '<div class="mb-1">Con riferimento all\'attività gestionale svolta negli anni accademici:</div>'
        },
        {
          type: 'textarea',
          key: 'descr_1',
          templateOptions: {
            label: 'c_label6',
            rows: 5,
            required: true,
            description: "con riferimento all'attività gestionale svolta nell'anno accademico"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.annoAccademico(1);
            }
          }
        },
        {
          type: 'textarea',
          key: 'descr_2',
          templateOptions: {
            label: 'c_label7',
            rows: 5,
            required: true,
            description: "con riferimento all'attività gestionale svolta nell'anno accademico"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.annoAccademico(2);
            }
          }
        },
        {
          type: 'textarea',
          key: 'descr_3',
          templateOptions: {
            label: 'c_label8',
            rows: 5,
            required: true,
            description: "con riferimento all'attività gestionale svolta nell'anno accademico"
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              return this.annoAccademico(3);
            }
          },
          hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
            return !this.triennio();
          },
        },
      ],
      hideExpression: (model: any, formState: any, field: FormlyFieldConfig) => {
        if (field.parent.model.flag_gestionale === 0 || field.parent.model.flag_gestionale === false) {
          return true;
        }
        return false;
      },
    },
  ]

  fields_sanzioni: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_sanzioni',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_sanzioni === false || model.flag_sanzioni === 0) {
                return 'DI NON ESSERE ' + this.translateService.instant('d1_label4',{periodo: this.numPeriodoTitle()});
              } else {
                return 'DI ESSERE  ' + this.translateService.instant('d1_label4',{periodo: this.numPeriodoTitle()});
              }
            }
          }
        },
      ]
    },
  ];

  fields: FormlyFieldConfig[] = [
     //didattica
     {
      key: "contenuto",
      fieldGroup: [
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: this.translateService.instant('d1_title1')
      },
      fieldGroup: this.fields_didattica
    },
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: this.translateService.instant('d1_title2')
      },
      fieldGroup: this.fields_ricerca
    },
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: this.translateService.instant('d1_title3')
      },
      fieldGroup: this.fields_gestionale
    },
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: this.translateService.instant('d1_title4')
      },
      fieldGroup: this.fields_sanzioni
    }
  ]},
  ];

  entityCache: any = null;

  constructor(protected service: DomandaService, protected route: ActivatedRoute, protected router: Router, protected location: Location,
    protected translateService: TranslateService, ) {
    super(route, router, location);
    this.activeNew = false;
    this.isRemovable = false;
    this.researchPath = 'home/domanda/view/';
    this.entityCache = history.state ? history.state.entity : null;
    console.log(this.entityCache);
  }

  modelIntestazione: any = null;
  update: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.clearMessage();
      if (params.has('act')) {
        if (params.get('act') == 'new'|| params.get('act') == 'newistance') {
          this.update = false;
          if (params.has('id')) {
            this.isLoading = true;
            this.options.formState.isLoading = true;
            const azione = params.get('act');
            //params['id'] coneitene il parametro letto dalla url, può contenere un id o anche la parola new
            this.service.getIntestazioneBando(params.get('id')).subscribe(
              result => {
                this.isLoading = false;
                if (azione == 'new'){
                  if (result.success) {
                    this.modelIntestazione = result.data;
                    this.model.bando_id = this.modelIntestazione.id;
                  } else {
                    this.router.navigate(['home/domanda/view', result.data.id]);
                    this.service.messageService.error(result.message);
                  }
                }
                if (azione == 'newistance'){
                  if (result.success) {
                    this.modelIntestazione = result.data;
                    this.model.bando_id = this.modelIntestazione.id;
                  } else {
                    const domanda = result.data;
                    const bando = result.data.bando;
                    bando.user = domanda.user;

                    if (this.entityCache){
                      this.model.contenuto = this.entityCache.contenuto;
                    }                 
                    this.model.flag_reinoltro = true;
                    this.model.bando_id = bando.id;
                    this.modelIntestazione = bando;
                   
                  }
                }

                //se per questo utente e questo bando esiste già una domanda
                //reindirizzare alla pagina view
              }
            );
          }
        }
        if (params.get('act') == 'upd') {
          this.isLoading = true;
          this.update = true;
          //params['id'] coneitene il parametro letto dalla url, può contenere un id o anche la parola new
          this.service.getById(params.get('id')).subscribe(
            result => {
              this.isLoading = false;
              
              try {
                this.model.contenuto = JSON.parse(result.contenuto);
              } catch (e) {
                var stringified = JSON.stringify(result.contenuto);
                this.model.contenuto = JSON.parse(stringified);
              }
              
              this.model.id = result.id;
              const bando = result.bando;
              bando.user = result.user;
              this.modelIntestazione = bando;
              
              //se per questo utente e questo bando esiste già una domanda
              //reindirizzare alla pagina view
            },
            error => { 
              this.isLoading = false; 
            },
            () => {
              this.isLoading = false;
            }
            
          );
        }
      }
    });
  }

  //2016-2018
  //si parte sempre dall'anno più altro
  annoAccademico(num) {
    //if (this.modelIntestazione.sessione == "prima"){
      return ((this.modelIntestazione.periodo_inizio - 1) + (num-1))+"/" + (this.modelIntestazione.periodo_inizio + (num-1));
    //}
    //return (this.modelIntestazione.periodo_inizio  + (num-1)) + "/" + (this.modelIntestazione.periodo_inizio + 1 + (num-1));
  }

  anno(num){
    return this.modelIntestazione.periodo_inizio +(num-1);
  }

  numAnni(){
    if (this.modelIntestazione){
      return this.modelIntestazione.periodo_fine-this.modelIntestazione.periodo_inizio;
    }
    return 0;
  }

  triennio() {
    if (this.modelIntestazione){
      return this.modelIntestazione.template_codice=='SDART6';
    }
    return false;
  }

  saveData() {
     this.onSubmit();
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      
      this.service.update(this.model, this.model.id ? this.model.id : null , true).subscribe(
        result => {
          this.isLoading = false;    
          if (result.success){
            this.router.navigate(['home/domanda/view/'+ result.data.id]);
          }else{
            this.service.messageService.error(result.message);
          }
        },
        error => {
          this.isLoading = false;
          //this.service.messageService.error(error);          
        });
    }
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

  numPeriodoTitle(){
    if (this.triennio())
      return this.translateService.instant('periodo_2');
    else 
      return this.translateService.instant('periodo_1');
  }

}
