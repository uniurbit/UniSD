import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-docenti',
  templateUrl: './dashboard-docenti.component.html',
  styleUrls: ['./dashboard-docenti.component.css']
})
export class DashboardDocentiComponent implements OnInit, AfterViewInit {

  public querybandi: any = {};
  public querydomande: any = {};

  constructor(public service: DashboardService, private datePipe: DatePipe) {
  
  }

  ngAfterViewInit() {
   
  }

  ngOnInit(): void {
    const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy'); 
    this.querybandi.rules = [        
      { field: "data_inizio", operator: "<=", value: today, type: "date" },
      { field: "data_fine",  operator: ">=", value: today, type: "date" },       
      { field: "stato",  operator: "=", value: 'abilitato', },             
    ]; 

    this.querydomande.rules = [];
  }
}
