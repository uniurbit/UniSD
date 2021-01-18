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


export interface InfraResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface InfraRequest<T> {    
  bando_id: number;
  entity: T;
}

@Injectable({
  providedIn: 'root'
})
export class BandoService extends BaseService {

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'sessione',
        type: 'select',
        hideExpression: false,
        templateOptions: {
          label: 'Sessione',
          disabled: true,
          options: [
            {value: 'prima', label: 'Prima sessione'},
            {value: 'seconda', label: 'Seconda sessione'},
          ]
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          label: 'Descrizione',
          required: true,
        }
      },
      {
        key: 'stato',
        type: 'select',
        templateOptions: {
          label: 'Stato',
          required: true,
          options: [
            {value: 'abilitato', label: 'Abilitato'},
            {value: 'disabilitato', label: 'Disabilitato'},
          ]
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

  deleteFile(id: number): Observable<any> {
    const url = `${this._baseURL + '/attachments/'}${id}`;
    let res = this.http.delete<any>(url, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Eliminazione documento effettuata con successo')
        ),
        catchError(this.handleError('deleteFile', null, false))
      );
    return res;
  }


  sendInfoEmail(data): Observable<InfraResponse<any>> {
    return this.http.post<any>(this._baseURL +`/${this.basePath}/sendinfoemail`, data, httpOptions).pipe(
      catchError(this.handleError('sendEmailRichiestaCompilazione', null, true)),
    );
  }
}
