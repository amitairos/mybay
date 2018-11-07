import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DBProduct } from '../../services/products.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  product: DBProduct;
  showError;
  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data)
      this.product = data.Product;
    else
      this.product = new DBProduct();
  }

  saveChanges(f: NgForm) {
    if (f.form.valid) {
      this.dialogRef.close({ Product: this.product });
    }
    else {
      this.showError = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
