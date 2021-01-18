import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { tap, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { not } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{
  public config: PerfectScrollbarConfigInterface = {};  

  isLoading: boolean = false;
  model: any;

  constructor(private service: NotificationService, private modalService: NgbModal, public activeModal: NgbActiveModal, protected router: Router) {}

  form =  new FormGroup({});
  modelNotification: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [  
    {
      key: 'subject',
      type: 'input',
      templateOptions: {
        label: 'Oggetto',        
        disabled: true,        
      },
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Contenuto',
        disabled: true,  
        rows: 5,      
      }
    }    
  ];
  
  querymodel = {
    rules: new Array<any>(),    
  };
  page: {
    size: number;
    totalElements: any;
    pageNumber: any;
    previousPage: any;
  };


  ngOnInit(): void {        
    this.loadData();
  }

  open(content, notification) {
    if (notification.data.subject || notification.data.description){
      this.modelNotification = notification.data;      
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {   
      }, (reason) => {      
      });
    } 
  }

  onOpen(notification){
    if (!notification.data)
      return;

  }
    
  loadPage(pageNumber: number) {
    console.log(pageNumber)
    if (this.page.pageNumber !== this.page.previousPage) {
      this.page.previousPage = pageNumber;
      this.loadData();
    }
  }


  loadData() {
    if (this.page){
      this.querymodel['limit']= this.page.size;
      this.querymodel['page']= this.page.pageNumber;
    }
    this.isLoading = true;
    this.service.query(this.querymodel).pipe(      
      tap(x =>  setTimeout(()=> { this.isLoading = false; }, 0) )
    ).subscribe(
      (res) => {
        this.model = res.data;

        this.page = {
          totalElements: res.total,
          pageNumber: res.current_page,
          size: res.per_page,
          previousPage:  res.current_page,
        }        
      }
    );
  }
  
  
}
