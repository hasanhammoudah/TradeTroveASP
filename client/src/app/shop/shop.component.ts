import { ShopParams } from './../shared/models/shopParams';
import { Brand } from '../shared/models/brand';
import { Product } from '../shared/models/product';
import { Type } from '../shared/models/type';
import { ShopService } from './shop.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{
  //TODO what means ViewChild
  @ViewChild('search') serachTerm?: ElementRef;
  products: Product[] = [];
  brands:Brand[]=[];
  types:Type[] = [];
  shopParams:ShopParams;
  sortOptions = [
    {name:'Alphabetical',value:'name'},
    {name:'Price: Low to high',value:'PriceAsc'}, 
    {name:'Price: High to low',value:'PriceDesc'},
  ];
  totalCount=0;

  constructor(private shopService: ShopService){
    this.shopParams = shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBarnds();
    this.getTypes();
  }

  getProducts(){
    this.shopService.getProducts().subscribe({
      next:response => {
        this.products = response.data;
        // this.shopParams.pageNumber=response.pageIndex;
        // this.shopParams.pageSize=response.pageSize;
        this.totalCount=response.count;
      },
      error:error=>console.log(error)
    })
  }
  getBarnds(){
    this.shopService.getBrands().subscribe({
      //TODO what is ...response
      next:response => this.brands = [{id:0,name:'All'}, ...response],
      error:error=>console.log(error)
    })
  }
  getTypes(){
    this.shopService.getTypes().subscribe({
      next:response => this.types = [{id:0,name:'All'}, ...response],
      error:error=>console.log(error)
    })

    
  }
  onBrandSelected(brandId:number){
    const params=this.shopService.getShopParams();
    params.brandId =brandId;
     params.pageNumber=1;
     this.shopService.setShopParams(params);
     this.shopParams=params;
     this.getProducts();
  }

  onTypeSelected(typeId:number){
    const params=this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber=1;
    this.shopService.setShopParams(params);
    this.shopParams=params;
    this.getProducts();
  }

  onSortSelected(event:any){
    const params=this.shopService.getShopParams();

     params.sort =event.target.value;
     this.shopService.setShopParams(params);
     this.shopParams=params;
     this.getProducts();
  }
  onPageChanged(event:any){
    const params=this.shopService.getShopParams();

    if(params.pageNumber !== event){
      //TODO read more about event object
      params.pageNumber=event;
       this.shopService.setShopParams(params);
       this.shopParams=params;
       this.getProducts();
    }
  }
  onSearch(){
    const params=this.shopService.getShopParams();
    params.search = this.serachTerm?.nativeElement.value;
    params.pageNumber=1;
    this.shopService.setShopParams(params);
    this.shopParams=params;
    this.getProducts();
  }
  onReset(){
    if(this.serachTerm) this.serachTerm.nativeElement.value = '';
    this.shopParams=new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
