import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '../../../node_modules/@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  sum: string;
  showHistory = false;
  disableCheckout = false;
  constructor(public cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.sumPrice();
  }

  sumPrice() {
    this.disableCheckout = false;
    this.sum = this.cartService.products.reduce((a, b) => a + b.Price * b.Quantity, 0).toFixed(2);
    this.cartService.products.forEach(product => {
      if (product.Quantity > product.Inventory) {
        this.disableCheckout = true;
      }
    });
  }

  removeProduct(product) {
    this.cartService.removeProductFromCart(product);
  }

  removePurchase(purchase) {
    this.cartService.removePurchase(purchase);
  }

  cancelPurchase(purchase) {
    this.cartService.cancelPurchase(purchase);
  }

  checkout() {
    //localStorage.setItem('cartProducts', JSON.stringify(this.cartService.products));

    this.router.navigate(['/checkout']);
  }

}
