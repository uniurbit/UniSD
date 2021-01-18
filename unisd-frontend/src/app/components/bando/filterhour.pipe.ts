import { Pipe, PipeTransform } from "@angular/core";
import {TranslateService} from '@ngx-translate/core';

@Pipe({
    name: 'myfilterhours',
    pure: false,
  })
  export class MyFilterhourPipe implements PipeTransform {
    constructor() {}
  
    transform(value: any, args?: any): any {
      if (value){
        return (value as string).replace("02:00","").replace("01:00","");
      }
      return value;
    }
  }