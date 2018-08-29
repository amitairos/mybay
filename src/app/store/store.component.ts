import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProductsService, DBProduct } from '../services/products.service';

export interface Product {
  Id: number;
  Name: string;
  Department: string;
  Description;
  Price: number;
  Inventory: number;
  Image: string;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  categories = [
    'All',
    'Books',
    'Games',
    'Computers',
    'Phones',
    'Clothing',
    'Jewelery',
    'Sports',
    'Auto'
  ]

  products: DBProduct[] = [];
  query;
  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    public productService: ProductsService,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    //this.products = this.productService.allProducts;
  }

  openProduct(product: DBProduct) {
    this.router.navigate(['/products/' + this.productService.allProducts.indexOf(product)])
  }


  openDepartment(category) {
    this.productService.categories.forEach(c => {
      if (c != category)
        c.ShowSub = false;
      else
        c.ShowSub = true;
    });
    if (category.Category == 'All')
      this.productService.filteredProducts = this.productService.allProducts;
    else
      this.productService.filteredProducts = this.productService.allProducts.filter(p => p.Category == category.Category);
  }

  openSubCategory(sub) {
    this.productService.filteredProducts = this.productService.allProducts.filter(p => p.SubCategory == sub);
  }

  search() {
    this.productService.filteredProducts = this.productService.allProducts.filter(p => p.Name.toLowerCase().includes(this.query.toLowerCase()))
  }
}
