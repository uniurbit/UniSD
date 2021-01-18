import { Component } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'formly-ag-grid-cell',
  template: `<formly-field [field]="getField()"></formly-field>`,
})
export class GridFormlyCellComponent implements ICellRendererAngularComp {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  getField(): FormlyFieldConfig {
    const rowIndex = this.params.rowIndex;
    const prop = this.params.colDef.field;
    const fg =  this.params.context.parentField.fieldGroup;

    return fg[rowIndex].fieldGroup.find(f => f.key === prop);
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */