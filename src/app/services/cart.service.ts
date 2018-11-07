import { Injectable } from '@angular/core';
import { Product } from '../store/store.component';
import { DBProduct, ProductsService } from './products.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { PaymentsService } from './payments.service';
import { BugsService } from './bugs.service';

export interface CartProduct {
  Id: string;
  Name: string;
  Price: number;
  Discount?: number;
  Inventory: number;
  Image: string;
  Quantity: number;
}

export interface Purchase {
  Products: CartProduct[];
  PriceSum: number;
  Date: Date;
  PaymentMethod: string;
  CCNumber?: number;
  DeliveryDate?: Date;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  products: CartProduct[] = [];
  purchases: Purchase[] = [];
  constructor(private db: AngularFirestore, private authService: AuthService,
    private paymentsService: PaymentsService, private productsService: ProductsService,
    private bugService: BugsService,
    private http: HttpClient) {
    //this.products = JSON.parse(localStorage.getItem('cartProducts'));
    //this.purchases = JSON.parse(localStorage.getItem('purchases'));
    this.authService.user.subscribe(user => {
      if (user)
        this.db.collection('Users').doc(user.email).valueChanges().subscribe(data => {
          if ((data as any).PurchaseHistory)
            this.purchases = ((data as any).PurchaseHistory as Purchase[]).reverse();

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

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  public addPurchase(cc?, pp?) {

    //Bug: Add unordered product to purchase
    if (this.bugService.bugs.find(b => b.Index == 3).Apply) {
      var random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 3).Random) + 1;

      if (random == 1) {
        var rand = this.productsService.allProducts[Math.floor(Math.random() * this.productsService.allProducts.length)];
        this.products.push({
          Id: rand.Id, Name: rand.Name, Price: rand.Price,
          Inventory: rand.Inventory, Image: rand.ImageLink, Quantity: 1
        });
      }

    }

    let products: CartProduct[] = JSON.parse(JSON.stringify(this.products));
    var paymentMethod;
    if (cc)
      paymentMethod = 'Credit card';
    else
      paymentMethod = 'PayPal';


    var today = new Date(Date.now());
    var max = new Date(Date.now());
    max.setDate(today.getDate() + 14);
    var delivery = this.randomDate(today, max);

    var purchase: Purchase = { Products: products, Date: new Date(Date.now()), PriceSum: products.reduce((a, b) => a + b.Price * b.Quantity, 0), PaymentMethod: paymentMethod, DeliveryDate: delivery };
    if (paymentMethod == 'Credit card') {
      purchase.CCNumber = cc;
    }

    if (this.bugService.bugs.find(b => b.Index == 12).Apply) {
      var random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 12).Random) + 1
      if (random == 1) {
        this.purchases.push(purchase);
      }
    }
    else {
      this.purchases.push(purchase);
    }

     //Bug: Add unordered product to purchase
     if (this.bugService.bugs.find(b => b.Index == 3).Apply) {
      var random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 3).Random) + 1;

      if (random == 1) {
        var rand = this.productsService.allProducts[Math.floor(Math.random() * this.productsService.allProducts.length)];
        this.products.push({
          Id: rand.Id, Name: rand.Name, Price: rand.Price,
          Inventory: rand.Inventory, Image: rand.ImageLink, Quantity: 1
        });
      }

    }

    this.clearProducts();
    var random = Math.floor(Math.random() * 3) + 1
    if (random == 1) {

    }
    return this.db.collection('Users').doc(this.authService.u.email).update({ PurchaseHistory: this.purchases }).then(updated => {
      return this.paymentsService.addPayment(true, purchase.PriceSum, purchase.Date, purchase.PaymentMethod, purchase.CCNumber).then(added => {
        return this.db.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {
          var first = data.data().FirstName;
          var last = data.data().LastName;
          var address = data.data().Address;



          var subject = 'Purchase Completed';

          const options = { headers: { 'Content-Type': 'application/json' } };
          var body = "Hi " + first + " " + last + "<br/><br/>Your order ";
          if (cc) {
            body += 'for Credit Card number: **** **** **** ' + cc;
          }
          else if (pp) {
            body += 'for PayPal account ' + pp;
          }
          body += ` has been received and will be shipped to ${address}.
      <br/>The order contains the following products:<br/><br/>`;

          purchase.Products.forEach(product => {
            body += `<div style='display: flex; width: 100%; margin:20px; align-items:left center; justify-content: left; text-align: left'>
        <div style='width: 15%;'>
        <img src="${product.Image}" style='max-width: 100%;
        max-height: 100px;
        display: block;'/>
        </div>
        `
            body += "<div style='margin: 10px;'><b>" + product.Name + "</b><br/>Price: <b>$" + product.Price + "</b><br/>Quantity: <b>" + product.Quantity + "</b>.</div> </div>";
          });

          body += '<br/>You have been charged <b>$' + purchase.PriceSum.toFixed(2) + '</b>';
          body += `<br/><br/>
          The estimated delivery for the purchase is <b>${delivery.toLocaleDateString()}</b>
          `;
          body += `<br/><br/>
            Thank you for using MyBay<br/><br/>
            <img src="https://mybay-990af.firebaseapp.com/assets/myBay.png" style=' height: auto;
      width: auto;
      max-height: 100px;
      max-width: 150px;
      object-fit: cover;'/>
      `;
          return this.http.post('https://mybay.herokuapp.com/email', JSON.stringify({ email: this.authService.authState.email, subject: subject, body: body }), options).subscribe(res => {
            console.log(res);
            if (res)
              return true;
          })
        });

      });

    });
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
    var canceled = this.db.collection('Users').doc(this.authService.u.email).update({ PurchaseHistory: this.purchases }).then(() => {
      return true;

    });

    return canceled;
    //localStorage.setItem('purchases', JSON.stringify(this.purchases));
  }



}
