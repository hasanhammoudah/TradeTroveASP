import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-test-input',
  templateUrl: './test-input.component.html',
  styleUrls: ['./test-input.component.scss']
})
export class TestInputComponent implements ControlValueAccessor {

 @Input() type='text';
 @Input() label='';

 //@Self() يُستخدم لتقييد حقن التبعية إلى المكون أو التوجيه الحالي فقط، مما يمنحك مزيدًا من التحكم في مصدر التبعية.
 constructor(@Self() public controlDir: NgControl) {
  this.controlDir.valueAccessor = this
}


  writeValue(obj: any): void {
    
  }
  registerOnChange(fn: any): void {
  
  }
  registerOnTouched(fn: any): void {
  
  }

   get control(): FormControl{
    return this.controlDir.control as FormControl;
   }
}
