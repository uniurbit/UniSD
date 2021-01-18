import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseEntityComponent } from 'src/app/shared';
import { BandoService } from 'src/app/services/bando.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, JsonPipe } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { takeUntil, tap } from 'rxjs/operators';
import { NgbStringAdapter } from 'src/app/NgbStringAdapter';
import { TranslateService } from '@ngx-translate/core';
import { encode, decode } from 'base64-arraybuffer';

@Component({
  selector: 'app-bando',
  templateUrl: './bando.component.html',
  styles: []
})

//creazione modifica bando
export class BandoComponent extends BaseEntityComponent {

  update: boolean = false;
  adapter = new NgbStringAdapter();
  fields: FormlyFieldConfig[] = [

    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: 'Dati base'
      },
      fieldGroup: [
        //descrizione 
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            //descrizione
            {
              key: 'descrizione',
              type: 'input',
              className: 'col-md-12',
              templateOptions: {
                required: true,
                translate: true,
                label: 'bando_label1', //descrizione
                maxLength: 190,
                description: "Esempio: Domanda per l'attribuzione degli scatti stipendiali triennali"
              },
            },
          ]
        },
        //data inizio e fine
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'data_inizio',
              type: 'datepicker',
              className: "col-md-6",
              templateOptions: {
                required: true,
                label: 'Data inizio',
              },
              hooks: {
                onInit: (field) => {
                  const form = field.formControl;
                  field.formControl.valueChanges.pipe(
                    takeUntil(this.onDestroy$),
                    tap(val => {
                      if (field.formControl.valid) {
                        let al_giorno = field.parent.fieldGroup.find(x => x.key == 'data_fine');
                        al_giorno.templateOptions.datepickerOptions.minDate = this.adapter.fromModel(val);
                        this.cdr.detectChanges();
                        //console.warn(field,field.formControl.valid, val)
                      }
                    }),
                  ).subscribe();
                },
              },
            },
            {
              key: 'data_fine',
              type: 'datepicker',
              className: "col-md-6",
              templateOptions: {
                required: true,
                label: 'Data fine',
              }
            }
          ]
        },

        //template
        {
          key: 'template_codice',
          type: 'select',
          className: 'col-md-6',
          templateOptions: {
            label: 'Modello domanda',
            required: true,
            options: [
              {value: 'SDART1', label: 'Scatti docenti biennali (art. 1 e art. 6)'},
              {value: 'SDART6', label: 'Scatti docenti triennali (art. 6)'},
            ]
          }
        },

        //periodo inizio e fine
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'periodo_inizio',
              type: 'number',
              className: 'col-md-6',
              templateOptions: {
                required: true,
                translate: true,
                min: 2014,
                max: 2030,
                label: 'bando_periodo_inizio', 
                description: 'Anno solare di inizio periodo è compreso'
              },
            },
            {
              key: 'periodo_fine',
              type: 'number',
              className: 'col-md-6',
              templateOptions: {
                required: true,
                translate: true,
                min: 2014,
                max: 2030,
                label: 'bando_periodo_fine',
                description: 'Anno solare di fine periodo è compreso. Il periodo inizio fine deve essere coerente con il modello di domanda scelto. (es. biennale anno solare inizio 2017 anno solare fine 2018)'
              },
              expressionProperties: {
                'templateOptions.min': (model: any, formState: any) => {
                  if (model && model.periodo_inizio && model.template_codice){
                    return model.periodo_inizio + (model.template_codice ==  'SDART6' ? 2 : 1);
                  }
                  return 2014;
                },
                'templateOptions.max': (model: any, formState: any) => {
                  if (model && model.periodo_inizio && model.template_codice){
                    return model.periodo_inizio + (model.template_codice == 'SDART6' ? 2 : 1);
                  }
                  return 2030;
                },
              },
             },
          ],
        },
      
        //sessione stato
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'sessione',
              type: 'select',
              className: 'col-md-6',
              templateOptions: {
                label: 'Sessione',
                required: true,
                options: [
                  {value: 'prima', label: 'Prima sessione'},
                  {value: 'seconda', label: 'Seconda sessione'},
                ]
              }
            },
            {
              key: 'stato',
              type: 'select',
              className: 'col-md-6',
              templateOptions: {
                label: 'Abilitazione',
                required: true,
                options: [
                  {value: 'abilitato', label: 'Abilitato'},
                  {value: 'disabilitato', label: 'Disabilitato'},
                ]
              }
            },
          
          ],
        },

        // elenco candidati
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'filename_candidati',
              type: 'fileinput',
              className: 'col-md-6',
              templateOptions: {
                translate: true,
                label: 'bando_candidati',
                type: 'input',
                placeholder: 'Carica il documento . . . ',
                description: 'N.B. Il documento da caricare deve essere in formato CSV',
                accept: '.csv',
                maxLength: 255,
                onSelected: (selFile, field) => { this.onSelectCandidati(selFile, field); }
              },
            },
            {
              key: 'candidati',
              type: 'textarea',
              className: 'col-md-6',
              templateOptions: {
                required: true,
                label: 'Elenco candidati', 
                rows: 5,
                //disabled: true,
              },
            },
          ]
        },
         // elenco commissione
        {
          // elenco commissione
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'filename_commissione',
              type: 'fileinput',
              className: 'col-md-6',
              templateOptions: {
                translate: true,
                label: 'bando_commissione',
                type: 'input',
                placeholder: 'Carica il documento . . . ',
                description: 'N.B. Il documento da caricare deve essere in formato CSV',
                accept: '.csv',
                maxLength: 255,
                onSelected: (selFile, field) => { this.onSelectCommissione(selFile, field); }
              },
            },
            {
              key: 'commissione',
              type: 'textarea',
              className: 'col-md-6',
              templateOptions: {
                required: true,
                label: 'Elenco membri commissione', 
                rows: 5,
                //disabled: true,
              },
            },
          ]
        },
      ]
    },

    //allegati
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: this.translateService.instant('bando_title1')
      },
      fieldGroup: [
        {
          key: 'attachments',
          type: 'repeat',
          templateOptions: {
           // translate: true,
           // label: 'a1_label19',
            min: 0,
            max: 5,
            btnHidden: false,
            btnRemoveHidden: true,
          },
          fieldArray: {
            fieldGroup: [
              {
                fieldGroupClassName: 'row',
                fieldGroup: [                                                  
                  // filename
                  {
                    key: 'filename',
                    type: 'fileinput',
                    className: 'col-md-5',
                    validation: {
                      show: true
                    },
                    templateOptions: {
                      translate: true,
                      label: 'file_label2',
                      type: 'input',
                      placeholder: 'Carica il documento . . . ',
                      description: 'N.B. Il documento da caricare deve essere in formato PDF',
                      accept: 'application/pdf',
                      maxLength: 255,
                      required: true,
                      onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
                    },
                  },
                  //descrizione file
                  {
                    key: 'description',
                    type: 'input',
                    className: 'col-md-5',
                    templateOptions: {
                      required: true,
                      translate: true,
                      label: 'file_label1', //descrizione
                      maxLength: 190,
                    },
                  },
                  // attachmenttype_codice
                  {
                    key: 'attachmenttype_codice',
                    type: 'select',
                    className: "col-md-2",
                    defaultValue: 'BANDO_ALLEGATO',
                    templateOptions: {
                      options: [{ value: 'BANDO_ALLEGATO', label: 'Pubblico' }, { value: 'BANDO_ALLEGATO_PRIVATO', label: 'Privato solo Ufficio' }],                   
                      label: 'Visibilità',
                    },
                  },
                  // bottoni azione
                  {
                    fieldGroupClassName: 'btn-toolbar',
                    className: 'col-md-2 btn-group',
                    fieldGroup: [
                      {
                        type: 'button',
                        className: 'mt-2 pt-2',
                        templateOptions: {
                          btnType: 'primary oi oi-data-transfer-download',
                          title: 'Scarica il documento',
                          // icon: 'oi oi-data-transfer-download'
                          onClick: ($event, model, field) => this.download($event, model),
                        },
                        hideExpression: (model: any, formState: any) => {
                          return !model.id;
                        },
                      },
                      {
                        type: 'button',
                        className: 'mt-2 ml-2 pt-2',
                        templateOptions: {
                          btnType: 'danger oi oi-trash',
                          title: 'Elimina documento',                          
                          onClick: ($event, model, field) => this.deleteFile($event, model),
                        },
                        hideExpression: (model: any, formState: any) => {
                          return !model.id;
                        },
                      },
                    ],
                  },
                ],
              },
              {
                fieldGroupClassName: 'row',
                fieldGroup: [
                  {
                    key: 'filevalue',
                    type: 'input',
                    templateOptions: {
                      type: 'hidden'
                    },
                  },
                  {
                    key: 'id',
                    type: 'input',
                    templateOptions: {
                      type: 'hidden'
                    },
                  },
                ],
              },
            ],
          },
        },
      ]
    }

  ]

  constructor(protected service: BandoService, protected route: ActivatedRoute, protected router: Router, protected location: Location,
    private cdr: ChangeDetectorRef, protected translateService: TranslateService, ) {
    super(route, router, location);
    //this.title = 'Tipo pagamento'
    this.activeNew = false;
    this.isRemovable = true;
    this.researchPath = 'home/bandi';
    this.returnUrl = 'home/bandi/view';
  }


  ngOnInit() {
    this.isLoading=false;
    this.route.paramMap.subscribe(params => {
      this.service.clearMessage();
      console.log(params);
      if (params.has('id')){      
        this.update = true;  
        this.isLoading = true;
        this.options.formState.isLoading = true;
        //params['id'] coneitene il parametro letto dalla url, può contenere un id o anche la parola new
        this.service.getById(params.get('id')).subscribe((data) => {    
            setTimeout(()=> {              
              if (this.initObj)
                this.model = { ...JSON.parse(JSON.stringify(data)), ...this.initObj};
              else 
                this.model = JSON.parse(JSON.stringify(data));
                
              //aggiornamento riferimento nel formstate
              this.options.formState.model = this.model;

              this.isLoading = false;
              this.options.formState.isLoading = false;
              this.postGetById();       
            });                                        
          }
        );
      }
    });
  }
  

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.preOnSubmit();
      let tosubmit = { ...this.model, ...this.form.value };      
      this.preUpdate(tosubmit);
      this.service.update(tosubmit, tosubmit.id ? tosubmit.id : null , true).subscribe(
        result => {
          
          result = result.data;

          this.isLoading = false;          
          this.router.navigate([this.researchPath, result.id]);
          
          this.model = JSON.parse(JSON.stringify(result));
          this.options.resetModel(result);
          this.options.updateInitialValue();
          this.postOnSubmit();

          this.router.navigate([this.returnUrl, this.model.id]);

        },
        error => {
          this.isLoading = false;
          //this.service.messageService.error(error);          
        });
    }
  }


  onSelectCandidati(currentSelFile, field: FormlyFieldConfig) {
    const currentAttachment = field.formControl.parent.value;
    if (currentSelFile == null) {
      // caso di cancellazione
      currentAttachment.filevalue = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.isLoading = true;
      const ctr = field.formControl.parent.get('candidati');
      ctr.setValue(e.target.result);
      ctr.markAsDirty();
      this.isLoading = false;
    };
    reader.readAsText(currentSelFile);
  }

  onSelectCommissione(currentSelFile, field: FormlyFieldConfig) {
    const currentAttachment = field.formControl.parent.value;
    if (currentSelFile == null) {
      // caso di cancellazione
      currentAttachment.filevalue = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.isLoading = true;
      const ctr = field.formControl.parent.get('commissione');
      ctr.setValue(e.target.result);
      ctr.markAsDirty();
      this.isLoading = false;
    };
    reader.readAsText(currentSelFile);
  }

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig) {
    const currentAttachment = field.formControl.parent.value;
    if (currentSelFile == null) {
      // caso di cancellazione
      currentAttachment.filevalue = null;
      return;
    }

    this.isLoading = true;
    currentAttachment.model_type = 'bando';

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      this.isLoading = true;
      field.formControl.parent.get('filevalue').setValue(encode(e.target.result));
      if (currentSelFile.name.search('pdf') > 0) {
        try {
          field.formControl.markAsDirty();
        } catch (error) {
          console.log(error);
          this.isLoading = false;
        }
      }

      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    };
    reader.readAsArrayBuffer(currentSelFile);
  }

  download(event, model) {
    // implementare api
    this.service.download(model.id).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );
  }

  deleteFile(event, model){

    this.service.confirmationDialogService.confirm('Conferma', "Vuoi procedere con l'operazione di elminazione?" )
      .then((confirmed) => {
        if (confirmed){
          this.isLoading = true;
          this.service.deleteFile(model.id).subscribe(file => {
              //rimuovi il file dall'elenco    
              this.isLoading = false;
      
              this.router.navigate([this.returnUrl, this.model.id]);      
          },
          e => { 
            console.log(e); 
            this.isLoading = false;
          });       
        }
        //console.log(confirmed);        
      })
      .catch(() => {
        this.isLoading = false;
      });  
  }
}
