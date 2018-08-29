import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';

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

  constructor(public authService: AuthService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.afs.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {
      this.ccNumber = data.data().CreditCard;
      this.cvv = data.data().Cvv;
      this.paypalPass = data.data().PayPalPassword;
    })
  }

  sendPasswordResetEmail() {
    this.authService.sendPasswordResetEmail().then(sent => {
      if (sent) {
        this.showResetText = true;
      }
    });
  }
}
