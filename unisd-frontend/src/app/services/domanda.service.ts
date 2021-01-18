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
export class DomandaService extends BaseService {

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'bando.sessione',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Sessione bando',
          disabled: true,
          
        }
      },
      {
        key: 'bando.descrizione',
        type: 'string',
        templateOptions: {
          label: 'Descrizione bando',
          required: true,
         
        }
      },
      {
        key: 'stato',
        type: 'select',
        templateOptions: {
          label: 'Stato domanda',
          required: true,
          options: [
            { value: 0, label: 'Bozza'},
            { value: 1, label: 'Inoltrata'},
          ]
        }
      },
    ];

  }

  constructor(protected http: HttpClient,
    public messageService: MessageService,
    public confirmationDialogService: ConfirmationDialogService) {
    super(http, messageService, confirmationDialogService);
    this.basePath = 'domande';
  }

  download(id): Observable<any>{
    if (id) {
      return this.http.get(this._baseURL + '/attachments/download/' + id.toString(), httpOptions).pipe(catchError(this.handleError('download', null, false)));
    }
    return of([]);
  }

  getIntestazioneBando(id: any): Observable<any> {
    return this.http
    .get(this._baseURL +  `/${this.basePath}/intestazionebando/` + id.toString(), httpOptions).pipe(
      catchError(this.handleError('getIntestazioneBando'))
    );
  }

  //id della domanda
  downloadDomanda(id): Observable<any>{
    if (id) {
        return this.http.get( AppConstants.baseApiURL + '/domande/downloaddomanda/' + id.toString()).pipe(catchError(this.handleError('previewcontratto', null, false)));
    }
    return of([]);
  }

  previewDomanda(id): Observable<any>{
    if (id) {
        return this.http.get( AppConstants.baseApiURL + '/domande/previewdomanda/' + id.toString()).pipe(catchError(this.handleError('previewcontratto', null, false)));
    }
    return of([]);
  }

  
  terminaInoltra(data): Observable<InfraResponse<any>> {
    return this.http.post<any>(this._baseURL + `/${this.basePath}/terminainoltra/`, data)
      .pipe(catchError(this.handleError('terminaInoltra')));
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
