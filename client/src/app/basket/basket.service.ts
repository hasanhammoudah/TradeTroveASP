import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';
import { DeliveryMethod } from '../shared/models/DeliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  //TODO read about BehaviorSubject and read about $ for  basketSource$
  private basketSource = new BehaviorSubject<Basket | null>(null);
  // Note: $ this means is obseravble variable
  basketSource$ = this.basketSource.asObservable();


  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();

  constructor(private http:HttpClient) { }

  createPaymentIntent(){
    return this.http.post<Basket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id , {}).pipe(map(basket=>{
      this.basketSource.next(basket);
    }));
  }

  //TODO ارجعلهلا 
  setShippingPrice(deliveryMethod:DeliveryMethod){
      const basket = this.getCurrentBasketValue();
       if(basket){
        basket.shippingPrice = deliveryMethod.price;
        basket.deliveryMethodId = deliveryMethod.id;
        this.setBasket(basket);
       }
     
  }

  getBasket(id:string){
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id ).subscribe({
      next:basket=>{
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }


  setBasket(basket:Basket){
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next:basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item:Product | BasketItem,quantity=1){
   if(this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
     const basket = this.getCurrentBasketValue() ?? this.createBasket();
     basket.items = this.addOrUpdateItem(basket.items,item,quantity);
     this.setBasket(basket);
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x=>x.id === itemToAdd.id);
    if(item) item.quantity += quantity;
    else{
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
     return items;
  }

 private createBasket() : Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item:Product) : BasketItem{
    return {
      id:item.id,
      productName:item.name,
      price:item.price,
      quantity:0,
      pictureUrl:item.pictureUrl,
      brand:item.productBrand,
      type:item.productType
    }
  }
  removeItemFromBasket(id:number,quantity=1){
    const basket=this.getCurrentBasketValue();
    if(!basket) return;
    const item = basket.items.find(x=>x.id === id);
    if(item){
     item.quantity -=quantity;
     if(item.quantity === 0){
       basket.items = basket.items.filter(x=>x.id !==id);
     }
     if(basket.items.length > 0)this.setBasket(basket);
     else this.deleteBasket(basket);
    }
 
   }
   deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
     next:()=>{
      this.deleteLocalBasket();
     }
    })
   }

   deleteLocalBasket(){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
   }

  private calculateTotals(){
    const basket=this.getCurrentBasketValue();
    if(!basket)return;
    const subtotal = basket.items.reduce((a,b)=>(b.price * b.quantity) + a,0);
     const total = subtotal + basket.shippingPrice;
     //{} تُستخدم لإنشاء كائن يحتوي على القيم المراد إرسالها، مما يسهل تنظيم وإدارة البيانات، ويجعل الاشتراك في الـ BehaviorSubject أكثر فاعلية عند التعامل مع مجموعة من القيم المرتبطة.
     this.basketTotalSource.next({shipping:basket.shippingPrice,total,subtotal});
  }

  private isProduct(item:Product | BasketItem) : item is Product{
    return (item as Product).productBrand !== undefined;

  }
}
//reduce هي دالة تقوم بتكرار جميع العناصر في مصفوفة items داخل basket، حيث:
//b.price * b.quantity: يحسب السعر الإجمالي لكل عنصر عن طريق ضرب سعر العنصر (price) في كميته (quantity).
//+ a: يضيف الإجمالي للعنصر الحالي إلى المجموع المتراكم (a).
//0 هو القيمة الابتدائية للمجموع المتراكم.
//النتيجة هي الإجمالي الفرعي (subtotal) لكل العناصر في السلة. 