import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-created-dialog',
  templateUrl: './user-created-dialog.component.html',
  styleUrls: ['./user-created-dialog.component.css']
})
export class UserCreatedDialogComponent implements OnInit {
  ccNumber;
  cvv;
  email;
  paypalPass;

  constructor(private dialogRef: MatDialogRef<UserCreatedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.ccNumber = data.ccNumber;
    this.cvv = data.cvv;
    this.email = data.email;
    this.paypalPass = data.paypalPass;
  }


  ngOnInit() {
  }

}
