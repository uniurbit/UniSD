import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-intestazione',
  templateUrl: './intestazione.component.html',
  styleUrls: ['./intestazione.component.css']
})
// ng g c components/intestazione -s true --skipTests false
export class IntestazioneComponent implements OnInit {

  @Input() item:any;
  @Input() dettagli : boolean = false;

  
  @Output() download: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {    
  }

  get dateInfo(){
    return this.item.createdDate!=null ? this.item.createdDate : this.item.submitDate
  }
  
  onClickAttach(id){
    this.download.emit(id);
  }
}
