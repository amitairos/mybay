import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  Title;
  Body;
  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.Title = data.Title;
    this.Body = data.Body;
  }

  ngOnInit() {

  }

  yes() {
    this.dialogRef.close(true);
  }

  no() {
    this.dialogRef.close(false);
  }
}
