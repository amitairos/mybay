import { Injectable } from '@angular/core';
import { Product } from '../store/store.component';
import { DBProduct, ProductsService } from './products.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

export interface CartProduct {
  Id: number;
  Name: string;
  Price: number;
  Inventory: number;
  Image: string;
  Quantity: number;
}

export interface Purchase {
  Products: CartProduct[];
  PriceSum: number;
  Date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  products: CartProduct[] = [];
  purchases: Purchase[] = [];
  constructor(private db: AngularFirestore, private authService: AuthService,
    private productsService: ProductsService, private http: HttpClient) {
    //this.products = JSON.parse(localStorage.getItem('cartProducts'));
    //this.purchases = JSON.parse(localStorage.getItem('purchases'));
    this.authService.user.subscribe(user => {
      if (user)
        this.db.collection('Users').doc(user.email).valueChanges().subscribe(data => {
          this.purchases = (data as any).PurchaseHistory as Purchase[];

          if (this.purchases == null)
            this.purchases = [];
        })
    })
    if (this.products == null)
      this.products = [];

  }

  public addProductToCart(product: DBProduct, quantity) {
    this.products.push({
      Id: product.Id, Name: product.Name, Price: product.Price,
      Inventory: product.Inventory, Image: product.ImageLink, Quantity: quantity
    });

    //localStorage.setItem('cartProducts', JSON.stringify(this.products));
  }

  public removeProductFromCart(product: CartProduct) {
    var index = this.products.indexOf(product);
    this.products.splice(index, 1);

    //localStorage.setItem('cartProducts', JSON.stringify(this.products));
  }

  public clearProducts() {
    this.products = [];
    //localStorage.setItem('cartProducts', JSON.stringify(this.products));
  }

  public addPurchase(cc?, pp?) {
    let products: CartProduct[] = JSON.parse(JSON.stringify(this.products));
    var purchase: Purchase = { Products: products, Date: new Date(Date.now()), PriceSum: products.reduce((a, b) => a + b.Price * b.Quantity, 0) };

    this.purchases.push(purchase);
    this.clearProducts();
    this.db.collection('Users').doc(this.authService.u.email).update({ PurchaseHistory: this.purchases })
    const options = { headers: { 'Content-Type': 'application/json' } };
    var body = '<p>Your order ';
    if (cc) {
      body += 'for Credit Card number: **** **** **** ' + cc;
    }
    else if (pp) {
      body += 'for PayPal account ' + pp;
    }
    body += ' has been received.<br/><br/>You have been charged <b>$' + purchase.PriceSum + '</b><br/><br/> Thank you for using MyBay.</p>';
    this.http.post('https://mybay.herokuapp.com/email', JSON.stringify({ email: this.authService.authState.email, body: body }), options).subscribe(res => {
      console.log(res);
    })
    //localStorage.setItem('purchases', JSON.stringify(this.purchases));
  }

  public removePurchase(purchase: Purchase) {

    var index = this.purchases.indexOf(purchase);

    this.purchases.splice(index, 1);
    this.db.collection('Users').doc(this.authService.u.email).update({ PurchaseHistory: this.purchases })
    //localStorage.setItem('purchases', JSON.stringify(this.purchases));
  }

  public cancelPurchase(purchase: Purchase) {

    var index = this.purchases.indexOf(purchase);

    this.purchases.splice(index, 1);
    this.db.collection('Users').doc(this.authService.u.email).update({ PurchaseHistory: this.purchases })

    purchase.Products.forEach(p => {
      p.Inventory += p.Quantity;
      this.productsService.allProducts.forEach(product => {
        if (p.Id == product.Id)
          this.productsService.updateProduct(p);
      });
    });
    //localStorage.setItem('purchases', JSON.stringify(this.purchases));
  }



}
