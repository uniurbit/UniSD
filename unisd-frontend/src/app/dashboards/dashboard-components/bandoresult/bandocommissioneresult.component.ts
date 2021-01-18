import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/shared/lookup/page';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MycurrencyPipe } from 'src/app/shared/pipe/custom.currencypipe';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { CoreSevice, BaseService, BaseResearchComponent } from 'src/app/shared';
import { BandoService } from 'src/app/services/bando.service';
import { pipe } from 'rxjs';
import { BandoComponent } from 'src/app/components/bando/bando.component';
import { BandoCommissioneService } from 'src/app/services/bandocommissione.service';


@Component({
  selector: 'app-bandocommissioneresult',
  templateUrl: './bandoresult.component.html', 
  styles: []
})
export class BandoCommissioneResultComponent extends BaseResearchComponent  {
  isLoadingResult: boolean = false;

  @ViewChild('seleziona') seleziona: TemplateRef<any>;
  @ViewChild('tooltip') tooltipCellTemplate: TemplateRef<any>;

  @Input() querymodel: any;
  @Input() postname = null;

  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  @Input() columns: [] = null;

  currency = new MycurrencyPipe();
  titlecase = new TitleCasePipe()
  translate: MyTranslatePipe;

  orderColumn: String[];


  constructor(public service: BandoCommissioneService, public router: Router, public route: ActivatedRoute, private datePipe: DatePipe, private translateService: TranslateService) {
    super(router,route)
    this.routeAbsolutePath = 'home/';
    this.enableNew = false;
    this.prefix = 'bandocommissione';
    this.translate = new MyTranslatePipe(translateService);
  }

  ngOnInit() {

    let page = new Page(3);
    let result = null;
    
    if (this.getStorageResult()) {
      result = JSON.parse(this.getStorageResult());
      this.init = true;
      page.totalElements = result.total; // data.to;
      page.pageNumber = result.current_page - 1;
      page.size = result.per_page;
    }
       
    let baseColumns = [
      { name: '#', prop: 'id', width: 80, maxWidth: 80 },
      { name: 'Titolo bando', prop: 'descrizione', width: 400, maxWidth: 400 },
      { name: 'Sessione', prop: 'sessione', pipe: this.translate, with:130, maxWidth: 130},
      { name: 'Data inizio', prop: 'data_inizio', width: 100, maxWidth: 130 },
      { name: 'Data fine', prop: 'data_fine', width: 100, maxWidth: 130 },
      { name: 'Periodo', prop: 'periodo_riferimento', width: 80, maxWidth: 100 },
      { name: 'Stato', prop: 'current_state', width: 50, maxWidth: 100 },
      { name: '', prop: 'id', width: 150, maxWidth: 150, cellTemplate: this.seleziona },
    ]
    
    if (this.columns){
      baseColumns = baseColumns.concat(this.columns);
    }

    this.resultMetadata = [
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
      
      this.onFind(this.querymodel);
      
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

  rowSelection(row) {
    this.change.emit(row);
  }

  onDblclickRow(event) {
    if (event.type === 'dblclick') {
     
    }
   
  }

 

}
