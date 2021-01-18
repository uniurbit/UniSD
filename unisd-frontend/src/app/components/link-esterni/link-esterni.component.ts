import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PDFAnnotationData, PDFDocumentProxy } from 'pdfjs-dist';
import { FormlyFieldConfig, Field, FormlyFormOptions } from '@ngx-formly/core';
import { FieldExpressionExtension } from '@ngx-formly/core/lib/extensions/field-expression/field-expression';
import { FormGroup } from '@angular/forms';
import { TNODE } from '@angular/core/src/render3/interfaces/injector';
import { setTNodeAndViewData } from '@angular/core/src/render3/state';

@Component({
  selector: 'app-link-esterni',
  templateUrl: './link-esterni.component.html',
  styleUrls: ['./link-esterni.component.css']
})
export class LinkEsterniComponent implements OnInit {

  pdfSrc: string;
  isLoading: boolean = false;
  // screen DPI / PDF DPI
  readonly dpiRatio = 96 / 72;
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (params.get('val') === 'ugovdidattica') {
          this.routeLgUgovDidattica();
        } else if (params.get('val') === 'precontreditabile') {
          this.routePrecontrEditabile();
        }
      }
    );
  }

  loadComplete(event){
    this.isLoading=false;
  }

  routeLgUgovDidattica() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + '/assets/documents/lgocd_ugov_didattica.pdf';
    //window.open(fileURL, '_blank');
  }


  routePrecontrEditabile() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + '/assets/documents/precontr_editabile.pdf';
    //window.open(fileURL, '_blank');
  }

  onOpen(){
    window.open(this.pdfSrc, '_blank');
  }

  onDownload(){
    
    this.http.get(this.pdfSrc,{responseType: 'blob'}).subscribe(res =>{
      const names: string[] = this.pdfSrc.split('/');
      saveAs(res,names[names.length-1])
    });
  }

 
}
