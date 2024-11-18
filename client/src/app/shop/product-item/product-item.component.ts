import { BasketService } from './../../basket/basket.service';
import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
@Input() product?: Product;

constructor(private basketService:BasketService){}
addItemToBasket(){
 this.product && this.basketService.addItemToBasket(this.product);
}
}
