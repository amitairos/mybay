import { Injectable } from '@angular/core';
import { Product } from '../store/store.component';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { CartProduct } from './cart.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

export interface DBProduct {
  Id: number;
  Category: string;
  SubCategory: string;
  Name: string;
  Description: string;
  Price: number;
  ImageLink: string;
  Inventory: number;
}

export interface ProductCategory {
  Category: string;
  SubCategories: string[];
  ShowSub: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // public allProducts: Product[] = [
  //   { Id: 1, Name: "Nokia C2", Department: 'Phones', Description: 'Very cool phone', Price: 200, Inventory: 5, Image: 'http://st1.bgr.in/wp-content/uploads/2014/12/939a5b8c7a3f57ef1cc964c46493ef22_375x500_1.jpg' },
  //   { Id: 2, Name: "Nokia C2", Department: 'Phones', Description: 'Very cool phone', Price: 200, Inventory: 5, Image: 'http://st1.bgr.in/wp-content/uploads/2014/12/939a5b8c7a3f57ef1cc964c46493ef22_375x500_1.jpg' },
  //   { Id: 3, Name: "Nokia C2", Department: 'Phones', Description: 'Very cool phone', Price: 200, Inventory: 5, Image: 'http://st1.bgr.in/wp-content/uploads/2014/12/939a5b8c7a3f57ef1cc964c46493ef22_375x500_1.jpg' },
  //   { Id: 4, Name: "Nokia C2", Department: 'Phones', Description: 'Very cool phone', Price: 200, Inventory: 5, Image: 'http://st1.bgr.in/wp-content/uploads/2014/12/939a5b8c7a3f57ef1cc964c46493ef22_375x500_1.jpg' },
  //   { Id: 5, Name: "Nokia C2", Department: 'Phones', Description: 'Very cool phone', Price: 200, Inventory: 5, Image: 'http://st1.bgr.in/wp-content/uploads/2014/12/939a5b8c7a3f57ef1cc964c46493ef22_375x500_1.jpg' },
  //   { Id: 6, Name: "Nokia C2", Department: 'Phones', Description: 'Very cool phone', Price: 200, Inventory: 5, Image: 'http://st1.bgr.in/wp-content/uploads/2014/12/939a5b8c7a3f57ef1cc964c46493ef22_375x500_1.jpg' },
  //   { Id: 7, Name: "Hp PC", Department: 'Computers', Description: 'Very cool PC', Price: 200, Inventory: 5, Image: 'https://store.hp.com/wcsstore/hpusstore/Treatment/HP_EB_x360_q1fy17_ksp1_pdt.jpg' },
  //   { Id: 8, Name: "Hp PC", Department: 'Computers', Description: 'Very cool PC', Price: 200, Inventory: 5, Image: 'https://store.hp.com/wcsstore/hpusstore/Treatment/HP_EB_x360_q1fy17_ksp1_pdt.jpg' },
  //   { Id: 9, Name: "Hp PC", Department: 'Computers', Description: 'Very cool PC', Price: 200, Inventory: 5, Image: 'https://store.hp.com/wcsstore/hpusstore/Treatment/HP_EB_x360_q1fy17_ksp1_pdt.jpg' },
  //   { Id: 10, Name: "Hp PC", Department: 'Computers', Description: 'Very cool PC', Price: 200, Inventory: 5, Image: 'https://store.hp.com/wcsstore/hpusstore/Treatment/HP_EB_x360_q1fy17_ksp1_pdt.jpg' },
  //   { Id: 11, Name: "Hp PC", Department: 'Computers', Description: 'Very cool PC', Price: 200, Inventory: 5, Image: 'https://store.hp.com/wcsstore/hpusstore/Treatment/HP_EB_x360_q1fy17_ksp1_pdt.jpg' },
  //   { Id: 12, Name: "Hp PC", Department: 'Computers', Description: 'Very cool PC', Price: 200, Inventory: 5, Image: 'https://store.hp.com/wcsstore/hpusstore/Treatment/HP_EB_x360_q1fy17_ksp1_pdt.jpg' },
  // ]

  public allProducts: DBProduct[];
  public filteredProducts: DBProduct[] = [];

  public categories: ProductCategory[] = [];
  constructor(private db: AngularFirestore) {
    // this.http.get('https://mybay.herokuapp.com/data').subscribe(data => {
    //   this.allProducts = (data as any).Products;
    //   console.log(this.allProducts);
    // })

    this.db.collection('Products').valueChanges().subscribe(data => {
      var id = 1;
      data.forEach(element => {
        (element as any).Id = id;
        id++;

      });
      this.allProducts = data as DBProduct[];
      this.filteredProducts = data as DBProduct[];

      var categories = this.removeDuplicates(this.allProducts, 'SubCategory');
      var main = this.removeDuplicates(categories, 'Category');
      this.categories=[];
      this.categories.push({ Category: 'All', SubCategories: null, ShowSub: false })
      main.forEach(c => {
        this.categories.push({ Category: c.Category, SubCategories: [], ShowSub: false })
      });
      categories.forEach(element => {
        this.categories.find(c => c.Category == element.Category).SubCategories.push(element.SubCategory);
      });

      console.log(this.categories);

    })
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  public updateProduct(product: CartProduct) {

//    const options = { headers: { 'Content-Type': 'application/json' } };
    this.allProducts.find(a => a.Id == product.Id).Inventory = product.Inventory;
    this.db.collection('Products').doc((product.Id - 1).toString()).update({ Inventory: product.Inventory });
    // this.http.post('https://mybay.herokuapp.com/update', JSON.stringify({ Id: product.Id, Inventory: product.Inventory }), options).subscribe(res => {
    //   console.log(res);
    // })
  }
}
