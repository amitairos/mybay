import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.css']
})
export class UserProfileDialogComponent implements OnInit {
  ccNumber;
  cvv;
  paypalPass;
  showResetText = false;
  address: string;
  nickname: string;
  showSaveButton = false;
  showPaymentMethodsSentText=false;
  showNewPaymentMethodsSentText=false;
  constructor(public authService: AuthService, private afs: AngularFirestore, private dialogRef: MatDialogRef<UserProfileDialogComponent>) { }

  ngOnInit() {
    this.afs.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {
      // this.ccNumber = data.data().CreditCard;
      // this.cvv = data.data().Cvv;
      // this.paypalPass = data.data().PayPalPassword;
      this.address = data.data().Address;
      this.nickname = this.authService.authState.displayName;
    })
  }

  sendPasswordResetEmail() {
    this.authService.sendPasswordResetEmail().then(sent => {
      if (sent) {
        this.showResetText = true;
      }
    });
  }

  saveChanges() {
    this.afs.collection('Users').doc(this.authService.authState.email).update({ Address: this.address });
    this.authService.authState.updateProfile({ displayName: this.nickname, photoUrl: null })
    this.showSaveButton=false;
  }

  forgotPaymentMethods() {
    this.authService.sendPaymentMethod(this.authService.authState.email).then(sent => {
      if(sent) {
        this.showPaymentMethodsSentText = true;
      }
    })
  }

  resetPaymentMethods() {
    this.authService.sendNewPaymentMethod(this.authService.authState.email).then(sent => {
      if(sent) {
        this.showNewPaymentMethodsSentText = true;
      }
    })
  }
}
