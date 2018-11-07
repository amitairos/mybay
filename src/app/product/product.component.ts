import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, DBProduct } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { BugsService } from '../services/bugs.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: DBProduct;
  discount: number = 0;
  quantityNum = 0;
  showError = false;
  quantityNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  similarProducts: DBProduct[] = [];
  showChooseQuantityText = false;
  myRating;
  thanks;

  constructor(private productsService: ProductsService,
    private cartService: CartService, private router: Router,
    private bugService: BugsService,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.product = this.productsService.allProducts.find(p => p.Id == params.id);

      var similar = this.productsService.allProducts.filter(p => p.Category == this.product.Category).filter(p => p.SubCategory == this.product.SubCategory);//.slice(pId, 1);
      var pId = similar.indexOf(this.product);
      similar.splice(pId, 1);
      similar = this.shuffle(similar);
      this.similarProducts = similar.slice(0, 4);

      this.myRating = this.productsService.ratings.find(p => p.Id == this.product.Id) ? this.productsService.ratings.find(p => p.Id == this.product.Id).Rating : null;
      if (this.myRating == null) {
        this.myRating = 0;
      }

    });
  }

  updateRating(rating) {
    this.thanks = "Thanks for the review!";
    var ratingNum = rating.rating;
    // this.product.Raters >= 0 ? this.product.Raters += 1 : this.product.Raters = 1;
    // if (this.product.Rating) {
    //   console.log('r');
    //   this.product.Rating = +(this.product.Rating + ((ratingNum - this.product.Rating) / this.product.Raters));
    // }
    // else {
    //   console.log('n');
    //   this.product.Rating = ratingNum;
    // }

    this.productsService.updateProductRating(this.product, ratingNum, this.myRating);
    this.product = this.productsService.allProducts.find(p => p.Id == this.product.Id);

    this.myRating = rating.rating;

    setTimeout(() => {
      this.thanks = null;
    }, 3000);

  }

  calculateDiscount() {
    this.discount = 0;
    this.productsService.discounts.forEach(discount => {
      if (this.quantityNum / this.product.Inventory >= discount.percent_from && this.quantityNum / this.product.Inventory <= discount.percent_to) {
        this.discount = discount.discount;
      }
    });
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  openProduct(product: DBProduct) {
    this.router.navigate(['/products/' + product.Id]);
  }


  addToCart() {
    //this.product.Inventory -= this.quantityNum;
    //Bug: Randomize add to cart

    var random = 1;
    if (this.bugService.bugs.find(b => b.Index == 1).Apply) {
      random = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 1).Random) + 1
    }
    else {
      random = 1;
    }

    if (random == 1) {
      if (this.quantityNum > 0) {
        this.showChooseQuantityText = false;
        //Bug: Allow to add even if not in inventory: 
        if (this.bugService.bugs.find(b => b.Index == 10).Apply || this.quantityNum <= this.product.Inventory) {
          //Bug: Randomize add quantity
          if (this.bugService.bugs.find(b => b.Index == 2).Apply) {
            var qrandom = Math.floor(Math.random() * this.bugService.bugs.find(b => b.Index == 2).Random) + 1
            if (qrandom == 1) {
              this.cartService.addProductToCart(this.product, 1);
            }
            else {
              this.cartService.addProductToCart(this.product, this.quantityNum);
            }
          }
          else {
            this.cartService.addProductToCart(this.product, this.quantityNum);
          }

          this.quantityNum = 0;
          this.router.navigate(['/cart']);
        }
        else {
          this.showError = true;
        }
      }
      else {
        this.showChooseQuantityText = true;
      }


    }
    else {
      if (this.quantityNum > 0) {
        this.showChooseQuantityText = false;
        this.router.navigate(['/cart']);
        // }
        // else {
        //   this.showError = true;
        // }
      }
      else {
        this.showChooseQuantityText = true;
      }

    }
  }
}
