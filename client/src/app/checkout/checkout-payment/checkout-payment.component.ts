import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {
@Input() checkoutForm? : FormGroup;

constructor(private basketService:BasketService,private checkoutService:CheckoutService,private router:Router,private toaster:ToastrService){}

submitOrder(){
  const basket = this.basketService.getCurrentBasketValue();
  if(!basket) return;
  const orderToCreate = this.getOrderToCreate(basket);
  if(!orderToCreate) return;
  this.checkoutService.createOrder(orderToCreate).subscribe({
    next:order=>{
      this.toaster.success('Order created asuccessfully');
  this.basketService.deleteLocalBasket();
      console.log(order);
    const navigationExtra:NavigationExtras ={state:order};
    this.router.navigate(['checkout/success'],navigationExtra);
    }
  })
}
  getOrderToCreate(basket: Basket) {
    const deliveryMethod = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;

    if(!deliveryMethod || !shipToAddress) return;
    return {
      basketId:basket.id,
      deliveryMethodId:deliveryMethod,
      shipToAddress:shipToAddress
    }
  }
}
