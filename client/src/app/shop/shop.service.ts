import { ShopParams } from './../shared/models/shopParams';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products:Product[] =[];
  brands:Brand[] = [];
  types:Type[] = [];
  pagination?:Pagination<Product[]>;
  shopParams = new ShopParams();
  productCache = new Map<string,Pagination<Product[]>>();

  constructor(private http:HttpClient) { }


  getProducts(useCache = true): Observable<Pagination<Product[]>>{
    // TODO what means at params varaible and append
    if(!useCache) this.productCache = new Map();
    if(this.productCache.size > 0 && useCache){
      if(this.productCache.has(Object.values(this.shopParams).join('-'))){
        this.pagination = this.productCache.get(Object.values(this.shopParams).join('-'));
        //of() هو مشغل من rxjs يستخدم لتحويل القيمة إلى Observable. هذا يسمح بإرجاع البيانات المخزنة دون الحاجة لإرسال طلب جديد إلى الخادم.
       if(this.pagination) return of(this.pagination);
      }
    }


    let params = new HttpParams();
  //append تُستخدم لإضافة معلمات استعلام جديدة إلى كائن HttpParams.
  //تُعيد نسخة جديدة من HttpParams مع المعلمات الجديدة، مما يسمح بإضافة معلمات متعددة بمرونة دون تعديل الكائن الأصلي
    if(this.shopParams.brandId > 0) params =params.append('brandId',this.shopParams.brandId);
    if(this.shopParams.typeId) params =params.append('typeId',this.shopParams.typeId);
     params =params.append('sort',this.shopParams.sort);
     params =params.append('pageIndex',this.shopParams.pageNumber);
     params =params.append('pageSize',this.shopParams.pageSize);
    if(this.shopParams.search) params =params.append('search',this.shopParams.search);

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products',{params}).pipe(
      map(response=>{
         // This line merges the existing products with new products from the response
         // It updates the `this.products` array to include both old and new items
        // Useful for scenarios like infinite scrolling or pagination where you need to combine data
        //this.products =[...this.products,... response.data];
        // هذه السطر يدمج المنتجات الحالية مع المنتجات الجديدة من الاستجابة
        // يقوم بتحديث مصفوفة `this.products` لتشمل كل من العناصر القديمة والجديدة
        // مفيد في حالات مثل التمرير اللانهائي أو التصفح عبر الصفحات حيث تحتاج لدمج البيانات
        this.productCache.set(Object.values(this.shopParams).join('-'), response);
        this.pagination = response;
        return response;
      })
    );
  }

  setShopParams(params:ShopParams){
    this.shopParams=params;
  }
  getShopParams(){
    return this.shopParams;
  }
  getProduct(id:number){
  // This line converts the values of the productCache Map into an array
// and uses reduce to merge all products into a single object.
// It searches for the product with the specified ID in the cached data.
// If the product is found in the cache, it returns it as an Observable.
// If not, it makes an HTTP GET request to fetch the product from the server.
// هذه السطر يحول قيم `productCache` (من نوع Map) إلى مصفوفة
// ويستخدم `reduce` لدمج جميع المنتجات في كائن واحد.
// يبحث عن المنتج الذي يحمل المعرف المحدد في البيانات المخزنة مؤقتًا.
// إذا تم العثور على المنتج في الذاكرة المؤقتة، يتم إرجاعه كـ Observable.
// إذا لم يكن موجودًا، يتم إرسال طلب HTTP GET للحصول على المنتج من الخادم.

    const product = [...this.productCache.values()].reduce((acc,paginatedResult)=>{
      return {...acc,...paginatedResult.data.find(x=>x.id===id)}
    },{} as Product);
    // console.log(product);
    if(Object.keys(product).length !==0) return of(product);
    return this.http.get<Product>(this.baseUrl + 'products/'+ id);
  }
  getBrands(){
    if(this.brands.length > 0) return of(this.brands);
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands').pipe(map(brands=>this.brands= brands));
  }

  getTypes(){
    if(this.types.length > 0) return of(this.types);
    return this.http.get<Type[]>(this.baseUrl + 'products/types').pipe(map(types=>this.types= types));
  }

}
