import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Discount } from '../../services/products.service';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.css']
})
export class SaleDialogComponent implements OnInit {
  discounts: Discount[];
  constructor(public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.discounts = JSON.parse(JSON.stringify(data.discounts));
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  saveChanges() {
    this.dialogRef.close(this.discounts);
  }

  addDiscount() {
    this.discounts.push({ percent_from: null, percent_to: null, discount: null })
  }

  deleteDiscount(discount) {
    this.discounts.splice(this.discounts.indexOf(discount), 1);
  }

}
