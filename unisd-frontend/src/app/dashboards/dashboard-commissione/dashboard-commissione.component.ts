import { Component, OnInit } from '@angular/core';
import { BandoCommissioneService } from 'src/app/services/bandocommissione.service';
import { encode, decode } from 'base64-arraybuffer';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-commissione',
  templateUrl: './dashboard-commissione.component.html',
  styles: []
})
export class DashboardCommissioneComponent implements OnInit {

  public querybandi: any = {};
  public querydomande: any = {};

  public model: any;
  
  private init=false;
  private prefix: string;

  constructor(protected service: BandoCommissioneService, private datePipe: DatePipe) { 
    this.prefix = 'bandointest_commissione';
  }

  ngOnInit() {
    if (this.getStorageResult()) {
      this.model = JSON.parse(this.getStorageResult());
      this.init = true;
    }

    const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy'); 
    this.querybandi.rules = [        
      { field: "data_fine",  operator: "<", value: today, type: "date" },                
    ]; 
  }

  selectionChange(event){
    if (event.id) {
      this.service.getById(event.id).subscribe((data) => {
        this.model = data;
        this.setStorageResult(this.model);
      },
      error => {
        
      });
    }
  }
 

  getStorageResult(){
    if (this.prefix){
      return sessionStorage.getItem(this.prefix+'_result');
    }     
    return null;
  }

  setStorageResult(result){
    if (this.prefix){
      sessionStorage.setItem(this.prefix+'_result',JSON.stringify(result));
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


}
