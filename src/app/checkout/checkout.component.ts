import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { BugsService } from '../services/bugs.service';

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
  showPaymentMethodsSentText = false;
  constructor(private productsService: ProductsService, private cartService: CartService, private bugService: BugsService,
    private afs: AngularFirestore, private authService: AuthService) { }

  ngOnInit() {
  }

  purchaseCC(number: number, cvv) {
    console.log(number, cvv);
    this.afs.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {
      if (!this.bugService.bugs.find(b => b.Index == 5).Apply && (number == data.data().CreditCard && cvv == data.data().Cvv && this.chosenMonth == 1 && this.chosenYear == 2025)) {
        //Bug: Show error even if valid
        if (this.bugService.bugs.find(b => b.Index == 8).Apply) {
          var random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 8).Random) + 1;
          if (random == 1) {
            this.showCCError = true;
            return;
          }
        }
        this.cartService.products.forEach(p => {
          p.Inventory -= p.Quantity;
          this.productsService.allProducts.forEach(product => {
            if (p.Id == product.Id)
              this.productsService.updateProductInventory(p);
          });
        });
        this.cartService.addPurchase(number.toString().replace(/.(?=.{4})/g, ''), null).then(completed => {
          if (completed)
            this.purchaseCompleted = true;
        });
      }
      else if (this.bugService.bugs.find(b => b.Index == 5).Apply) {
        console.log('in bug');
        //Bug - No CC validation, only validate if length is ok:and cvv and date*/) {
        if (number.toString().length == 16 && cvv.toString().length == 3 && this.chosenMonth.toString().length > 0 && this.chosenYear.toString().length > 0) {
          this.cartService.products.forEach(p => {
            p.Inventory -= p.Quantity;
            this.productsService.allProducts.forEach(product => {
              if (p.Id == product.Id)
                this.productsService.updateProductInventory(p);
            });
          });
          this.cartService.addPurchase(number.toString().replace(/.(?=.{4})/g, ''), null).then(completed => {
            if (completed)
              this.purchaseCompleted = true;
          });
        }
        else {
          this.showCCError = true;
        }
      }
      else {
        this.showCCError = true;
      }
    })


  }

  purchasePayPal(email, password) {
    this.afs.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {

      if (!this.bugService.bugs.find(b => b.Index == 7).Apply) {
        if (email == this.authService.authState.email && password == data.data().PayPalPassword) {

          this.cartService.products.forEach(p => {
            p.Inventory -= p.Quantity;
            this.productsService.allProducts.forEach(product => {
              if (p.Id == product.Id)
                this.productsService.updateProductInventory(p);
            });
          });
          this.cartService.addPurchase(null, email);
          this.purchaseCompleted = true;
        }
        else {
          this.showPPError = true;
        }
      }
      else {
        //Bug - No PP validation: if (email == this.authService.authState.email && password == data.data().PayPalPassword) {
        //Bug: Show error even if valid
        if (this.bugService.bugs.find(b => b.Index == 9).Apply) {
          var random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 9).Random) + 1;
          if (random == 1) {
            this.showPPError = true;
            return;
          }
        }
        if (email != null && password != null) {
          this.cartService.products.forEach(p => {
            p.Inventory -= p.Quantity;
            this.productsService.allProducts.forEach(product => {
              if (p.Id == product.Id)
                this.productsService.updateProductInventory(p);
            });
          });
          this.cartService.addPurchase(null, email);
          this.purchaseCompleted = true;
        }
        else {
          this.showPPError = true;
        }
      }

    });
  }

  forgotPaymentMethods() {
    this.authService.sendPaymentMethod(this.authService.authState.email).then(sent => {
      if (sent) {
        this.showPaymentMethodsSentText = true;
      }
    })
  }
}
