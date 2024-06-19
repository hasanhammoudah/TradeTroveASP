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
  shopParams=new ShopParams();
  sortOptions = [
    {name:'Alphabetical',value:'name'},
    {name:'Price: Low to high',value:'PriceAsc'}, 
    {name:'Price: High to low',value:'PriceDesc'},
  ];
  totalCount=0;

  constructor(private ShopService: ShopService){}

  ngOnInit(): void {
    this.getProducts();
    this.getBarnds();
    this.getTypes();
  }

  getProducts(){
    this.ShopService.getProducts(this.shopParams).subscribe({
      next:response => {
        this.products = response.data;
        this.shopParams.pageNumber=response.pageIndex;
        this.shopParams.pageSize=response.pageSize;
        this.totalCount=response.count;
      },
      error:error=>console.log(error)
    })
  }
  getBarnds(){
    this.ShopService.getBrands().subscribe({
      //TODO what is ...response
      next:response => this.brands = [{id:0,name:'All'}, ...response],
      error:error=>console.log(error)
    })
  }
  getTypes(){
    this.ShopService.getTypes().subscribe({
      next:response => this.types = [{id:0,name:'All'}, ...response],
      error:error=>console.log(error)
    })

    
  }
  onBrandSelected(brandId:number){
      this.shopParams.brandId =brandId;
      this.shopParams.pageNumber=1;
      this.getProducts();
  }

  onTypeSelected(typeId:number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  onSortSelected(event:any){
     this.shopParams.sort =event.target.value;
     this.getProducts();
  }
  onPageChanged(event:any){
    if(this.shopParams.pageNumber !== event){
      //TODO read more about event object
       this.shopParams.pageNumber=event;
       this.getProducts();
    }
  }
  onSearch(){
    this.shopParams.search = this.serachTerm?.nativeElement.value;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }
  onReset(){
    if(this.serachTerm) this.serachTerm.nativeElement.value = '';
    this.shopParams.pageNumber=1;
    this.shopParams=new ShopParams;
    this.getProducts();
  }
}
