import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '../../../node_modules/@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ProductsService } from '../services/products.service';
import { BugsService } from '../services/bugs.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  sum: number;
  quantityNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

  disableCheckout = false;
  constructor(public cartService: CartService, private productsService: ProductsService, private router: Router, private bugService: BugsService) { }

  ngOnInit() {
    this.sumPrice();
  }

  sumPrice() {
    this.disableCheckout = false;
    this.calculateDiscounts();
    this.sum = this.cartService.products.reduce((a, b) => a + (b.Price * b.Quantity * (1 - b.Discount)), 0);//.toFixed(2);


    //Bug - add wrong calculation to sum
    if (this.bugService.bugs.find(b => b.Index == 4).Apply) {
      var random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 4).Random) + 1
      if (random == 1) {
        this.sum += Math.floor(Math.random() * (100 - (-100) + 1)) + (-100);
      }
    }

    //Bug - allow purchase more than inventory
    if (this.bugService.bugs.find(b => b.Index == 11).Apply) {
      this.cartService.products.forEach(product => {
        if (product.Quantity > product.Inventory) {
          this.disableCheckout = true;
        }
      });
    }

  }

  removeProduct(product) {
    this.cartService.removeProductFromCart(product);
  }

  removeAllProducts() {
    this.cartService.products = [];
  }

  calculateDiscounts() {
    this.cartService.products.forEach(product => {
      product.Discount = 0;
      this.productsService.discounts.forEach(discount => {
        if (product.Quantity / product.Inventory >= discount.percent_from && product.Quantity / product.Inventory <= discount.percent_to) {
          product.Discount = discount.discount;
        }
      });
    });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

}
