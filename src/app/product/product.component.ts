import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../store/store.component';
import { ProductsService, DBProduct } from '../services/products.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: DBProduct;
  quantityNum = 0;
  showError = false;
  constructor(private productsService: ProductsService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.product = this.productsService.allProducts[params.id];
    });
  }

  addToCart() {
    //this.product.Inventory -= this.quantityNum;
    if (this.quantityNum <= this.product.Inventory) {
      this.cartService.addProductToCart(this.product, this.quantityNum);
      this.quantityNum = 0;
    }
    else {
      this.showError = true;
    }
  }
}
