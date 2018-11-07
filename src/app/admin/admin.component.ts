import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatIconRegistry } from '@angular/material';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { Product } from '../store/store.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router,
    public productService: ProductsService,
    private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
    private dialog: MatDialog) {
      this.matIconRegistry.addSvgIcon(
        "sale",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/sale.svg")
      );
     }

  ngOnInit() {
    this.productService.filteredProducts = this.productService.allProducts;
  }

  addNewProduct() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    const dialogRef = this.dialog.open(ProductDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data)
          this.productService.addProduct(data.Product);
      });
  }

  deleteProduct(product) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      Title: "Delete Product",
      Body: "Are you sure you want to delete this product? This cannot be undone"
    };

    const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data)
          this.productService.deleteProduct(product);
      });
  }

  openProductEditDialog(product) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      Product: product
    };

    const dialogRef = this.dialog.open(ProductDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          var index = this.productService.allProducts.indexOf(this.productService.allProducts.find(p => p.Id == data.Product.Id));
          this.productService.allProducts[index] = data.Product;
          this.productService.updateProduct(data.Product);
        }
      });
  }

  openSaleDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      discounts: this.productService.discounts
    };
    const dialogRef = this.dialog.open(SaleDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.productService.updateDiscounts(data);
        }
      });
  }

}
