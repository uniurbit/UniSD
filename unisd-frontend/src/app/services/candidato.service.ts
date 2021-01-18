import { Injectable } from '@angular/core';
import { BaseService, MessageService } from '../shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cacheable } from 'ngx-cacheable';
import { AppConstants } from '../app-constants';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export interface InfraResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatoService extends BaseService {

  getMetadata(): FormlyFieldConfig[] {
    return [
    ];

  }

  constructor(protected http: HttpClient,
    public messageService: MessageService,
    public confirmationDialogService: ConfirmationDialogService) {
    super(http, messageService, confirmationDialogService);
    this.basePath = 'candidati';
  }


  listabandi(model): Observable<any> {
    return this.http
      .post<any>(this._baseURL + `/bandi/query`, model, httpOptions).pipe(
        // NB. modifico aggiungendo la throw a true per rilanciare l'errore al chiamante come la finestra di lookup
        catchError(this.handleError('query', null, true))
      );
  }

  @Cacheable()
  listabandicommissione(model): Observable<any> {
    return this.http
      .post<any>(this._baseURL + `/bandi/querycommissione`, model, httpOptions).pipe(
        // NB. modifico aggiungendo la throw a true per rilanciare l'errore al chiamante come la finestra di lookup
        catchError(this.handleError('query', null, true))
      );
  }

  
}
