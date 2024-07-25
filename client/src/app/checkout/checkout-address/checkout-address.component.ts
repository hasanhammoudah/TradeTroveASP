import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent {
@Input() checkoutForm?: FormGroup;

//TODO:
constructor(private accountService:AccountService,private toaster:ToastrService){}

saveUserAddress(){
  this.accountService.updateUserAddress(this.checkoutForm?.get('addressForm')?.value).subscribe({
    //TODO:
   next:()=>{this.toaster.success('Address saved');
    this.checkoutForm?.get('addressForm')?.reset(this.checkoutForm?.get('addressForm')?.value);
   }
  })
}
}
