import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '../shared/models/DeliveryMethod';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
baseUrl = environment.apiUrl;

constructor(private http:HttpClient){}

getDeliveryMethod(){
  return this.http.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
    map(dm => {
      return dm.sort((a,b)=>b.price - a.price)
    })
  )
}
 
}
