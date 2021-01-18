import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/shared/lookup/page';
import { Router } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MycurrencyPipe } from 'src/app/shared/pipe/custom.currencypipe';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { CoreSevice, BaseService } from 'src/app/shared';
import { DomandaService } from 'src/app/services/domanda.service';

@Component({
  selector: 'app-domandaresult',
  templateUrl: './domandaresult.component.html', 
  styles: []
})
export class DomandaresultComponent implements OnInit {
  isLoading: boolean = false;

  @ViewChild('converter') converter: TemplateRef<any>;  
  @ViewChild('tooltip') tooltipCellTemplate: TemplateRef<any>;

  @Input() querymodel: any;
  @Input() postname = null;

  form = new FormGroup({});
  model = {
    data: new Array<any>(),
  };
  @Input() columns: [] = null;

  resultMetadata: FormlyFieldConfig[];

  currency = new MycurrencyPipe();
  titlecase = new TitleCasePipe()

  translate: MyTranslatePipe;

  orderColumn: String[];


  constructor(private service: DomandaService, private router: Router, private datePipe: DatePipe, private translateService: TranslateService) {
    this.translate = new MyTranslatePipe(translateService);
  }

  ngOnInit() {
       
    let baseColumns: Array<any> = [
      { name: '#', prop: 'id', width: 80, maxWidth: 80 },
      { name: 'Nome', prop: 'user.nome', width: 120, maxWidth: 130 },
      { name: 'Cognome', prop: 'user.cognome', width: 120, maxWidth: 130 },
      { name: 'Titolo bando', prop: 'bando.descrizione', width: 300, maxWidth: 300 },
      { name: 'Sessione', prop: 'bando.sessione', pipe: this.translate, with: 100, maxWidth: 100 },
      { name: 'Data fine bando', prop: 'bando.data_fine', width: 100, maxWidth: 130 },
      { name: 'Periodo', prop: 'bando.periodo_riferimento', width: 50, maxWidth: 100 },
      { name: 'Stato', prop: 'current_state', pipe: this.translate, width: 50, maxWidth: 100 },
      { name: 'Data ora inoltro', prop: 'data_inoltro', width: 100, maxWidth: 130 },
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
            onSetPage: (pageInfo) => this.onSetPage(pageInfo),
            onReorder: (event) => this.onReorder(event),
            columns: baseColumns,
          },
          fieldArray: {
            fieldGroup: []
          }
        }
      ];
      
      this.orderColumn = baseColumns.map(x => x.name);

      this.querymodel['limit']= 10;     
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



  onDblclickRow(event) {
    if (event.type === 'dblclick') {
      if (event.row.id){        
        this.router.navigate(['home/domanda/view', event.row.id]);
      }
    }
   
  }

  onSetPage(pageInfo){      
    if (pageInfo.limit)
      this.querymodel['limit']= pageInfo.limit;     
    if (this.model.data.length>0){
      this.querymodel['page']=pageInfo.offset + 1;     
      this.onFind(this.querymodel);
    }
  }

  onFind(model){
    this.querymodel.rules = model.rules;  
    if (model.orderBy){
      this.querymodel.orderBy = model.orderBy;
    }    

    this.isLoading = true;    
    try{      
      this.service.query(this.querymodel).subscribe((data) => {
        const to = this.resultMetadata[0].templateOptions;
        this.isLoading = false;   
        this.model=  {
          data: data.data
        }

        to.page.totalElements = data.total; // data.to;
        to.page.pageNumber = data.current_page-1;
        to.page.size = data.per_page;        
        
      }, err => {
        this.isLoading=false;
        console.error('Oops:', err.message);
      });
    }catch(e){
      this.isLoading = false;
      console.error(e);
    }
  }

}
