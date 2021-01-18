import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-form-wysiwyg-type',
  template: `
  <div  [class.is-invalid]="showError">
  <angular-editor id="{{key}}" [config]="config" 
   [formControl]="formControl" [formlyAttributes]="field" [class.is-invalid]="showError" ></angular-editor>
  </div>
  `,
  styleUrls: ['./wysiwyg.component.css']
})
export class WysiwygTypeComponent extends FieldType {

  // [style.display]="field.hide ? 'none' : 'block'"

  config: AngularEditorConfig = {
      editable: true,
      spellcheck: false,
      height: 'auto',
      minHeight: '5rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'no',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Inserisci il testo qui ...',
      defaultParagraphSeparator: '',
      toolbarPosition: 'top',
  };

}
