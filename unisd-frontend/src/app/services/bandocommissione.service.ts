import { Injectable } from '@angular/core';
import { BaseService, MessageService } from '../shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BandoCommissioneService extends BaseService {

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'uo',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Codice unità organizzativa',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'descr',
        type: 'string',
        templateOptions: {
          label: 'Descrizione',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'data_fin',
        type: 'date',
        templateOptions: {
          label: 'Data fine',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
    ];

  }

  constructor(protected http: HttpClient,
    public messageService: MessageService,
    public confirmationDialogService: ConfirmationDialogService) {
    super(http, messageService, confirmationDialogService);
    this.basePath = 'bandi';
  }

  download(id): Observable<any>{
    if (id) {
      return this.http.get(this._baseURL + '/attachments/download/' + id.toString(), httpOptions).pipe(catchError(this.handleError('download', null, false)));
    }
    return of([]);
  }

  //senza filtro chiusura...
  query(model): Observable<any> {
    return this.http
      .post<any>(this._baseURL + `/${this.basePath}/querycommissione`, model, httpOptions).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        // NB. modifico aggiungendo la throw a true per rilanciare l'errore al chiamante come la finestra di lookup
        catchError(this.handleError('query', null, true))
      );
  }

}
