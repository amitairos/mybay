import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  payment = 'cc';
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  chosenMonth;
  years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  chosenYear;
  purchaseCompleted = false;
  showCCError = false;
  showPPError = false;
  constructor(private productsService: ProductsService, private cartService: CartService,
    private afs: AngularFirestore, private authService: AuthService) { }

  ngOnInit() {
  }

  purchaseCC(number, cvv) {
    console.log(number, cvv);
    this.afs.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {

      if (number == data.data().CreditCard && cvv == data.data().Cvv && this.chosenMonth == 1 && this.chosenYear == 2025) {
        this.cartService.products.forEach(p => {
          p.Inventory -= p.Quantity;
          this.productsService.allProducts.forEach(product => {
            if (p.Id == product.Id)
              this.productsService.updateProduct(p);
          });
        });
        this.cartService.addPurchase(number.toString().replace(/.(?=.{4})/g, ''), null);

        this.purchaseCompleted = true;
      }
      else {
        this.showCCError = true;
      }

    })


  }

  purchasePayPal(email, password) {
    this.afs.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {
      if (email == this.authService.authState.email && password == data.data().PayPalPassword) {
        this.cartService.products.forEach(p => {
          p.Inventory -= p.Quantity;
          this.productsService.allProducts.forEach(product => {
            if (p.Id == product.Id)
              this.productsService.updateProduct(p);
          });
        });
        this.cartService.addPurchase(null, email);
        this.purchaseCompleted = true;
      }
      else {
        this.showPPError = true;
      }
    });
  }
}
