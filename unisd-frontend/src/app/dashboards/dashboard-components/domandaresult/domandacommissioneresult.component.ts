import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/shared/lookup/page';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MycurrencyPipe } from 'src/app/shared/pipe/custom.currencypipe';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { CoreSevice, BaseService, BaseResearchComponent } from 'src/app/shared';
import { DomandaCommissioneService } from 'src/app/services/domandacommissione.service';

@Component({
  selector: 'app-domandacommissioneresult',
  templateUrl: './domandaresult.component.html', 
  styles: []
})
export class DomandacommissioneresultComponent extends BaseResearchComponent {

  @ViewChild('converter') converter: TemplateRef<any>;  
  @ViewChild('tooltip') tooltipCellTemplate: TemplateRef<any>;

  @Input() querymodelres: any;
  @Input() postname = null;
  @Input() columns: [] = null;

  currency = new MycurrencyPipe();
  titlecase = new TitleCasePipe()
  translate: MyTranslatePipe;

  orderColumn: String[];


  constructor(public service: DomandaCommissioneService, router: Router,  route: ActivatedRoute,  private datePipe: DatePipe, private translateService: TranslateService) {
    super(router, route);
    this.translate = new MyTranslatePipe(translateService);

    this.routeAbsolutePath = 'home/domanda/view';
    this.enableNew = false;
    this.prefix = 'domandecommissionedashboard';
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
       
    let baseColumns: Array<any> = [
      { name: '#', prop: 'id', width: 80, maxWidth: 80 },
      { name: 'Nome', prop: 'user.nome', width: 100, maxWidth: 130 },
      { name: 'Cognome', prop: 'user.cognome', width: 100, maxWidth: 130 },
      { name: 'Titolo bando', prop: 'bando.descrizione', width: 350, maxWidth: 350},
      { name: 'Numero protocollo', prop: 'num_prot', width: 170, maxWidth: 180 },
      { name: 'Sessione', prop: 'bando.sessione', pipe: this.translate, with:100, maxWidth: 100},
      { name: 'Periodo', prop: 'bando.periodo_riferimento', width: 50, maxWidth: 100 },
      { name: 'Stato', prop: 'current_state', pipe: this.translate, width: 100, maxWidth: 100 },
    ]
    
    if (this.columns){
      baseColumns = baseColumns.concat(this.columns);
    }
    
    baseColumns = this.applyOrder(baseColumns);  

    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          templateOptions: {
            label: 'Risultati',   
            columnMode: 'force',
            headerHeight: 50,
            footerHeight: 50,            
            scrollbarH: true,             
            hidetoolbar: true, 
            selected: [],                        
            page: new Page(25),       
            onDblclickRow: (event) => this.onDblclickRow(event),
            onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
            onReorder: (event) => this.onReorder(event),
            columns: baseColumns,
          },
          fieldArray: {
            fieldGroup: []
          }
        }
      ];
      
      this.orderColumn = baseColumns.map(x => x.name);

      if (result) {
        this.setResult(result);
      }
      
  }

  selectionChange(event){
    if (event.current_state.toUpperCase()=='CHIUSO'){
      const query ={
        rules: [        
          { field: "bando.id", operator: "=", value: event.id },
          { field: "stato", operator: "=", value: 1},        
        ]
      };
      this.onFind(query,true);
    }else{
      this.resetResult();
    }
  }

  applyOrder(columns: Array<any>){
    if (this.postname){      
      this.orderColumn = JSON.parse(localStorage.getItem('order_'+this.postname));
      if (this.orderColumn && this.orderColumn.length>0)
      columns = columns.sort((a,b)=> {
        let A = a['name'];
        let B = b['name'];
        if (this.orderColumn.indexOf(A)>this.orderColumn.indexOf(B)){
          return 1;
        }else{
          return -1;
        }
      });      
    }
    return columns;
  }


  onReorder(event){ 
   
    let temp = this.orderColumn[event.newValue];
    this.orderColumn[event.newValue] = this.orderColumn[event.prevValue];
    this.orderColumn[event.prevValue] = temp;

    if (this.postname){
      localStorage.setItem('order_'+this.postname,JSON.stringify(this.orderColumn));
      console.log(this.orderColumn);
    }
            
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);    
  };




}
