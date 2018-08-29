import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { UserCreatedDialogComponent } from '../user-created-dialog/user-created-dialog.component';

@Injectable()
export class AuthService {
  authState: any = null;
  public user: Observable<firebase.User>;
  u: firebase.User;
  constructor(private db: AngularFirestore, private firebaseAuth: AngularFireAuth, private router: Router, private dialog: MatDialog) {
    this.user = firebaseAuth.authState;
    this.firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    this.firebaseAuth.authState.subscribe((auth) => {
      if (auth) {
        this.u = auth;
        this.authState = auth;
        //router.navigate(['/store']);
      }
    });
  }

  signup(email: string, password: string, name: string, nickname: string) {
    var cc = Math.floor(Math.random() * 10000000000000000);
    var cvv = Math.floor(Math.random() * 1000);
    var date = new Date(2025, 1, 1);
    var paypalPass = this.generatePassword();

    this.db.collection('Users').doc(email).set({ CreditCard: cc, Cvv: cvv, Date: date, PayPalPassword: paypalPass });

    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.u = value.user;
        this.u.updateProfile({ displayName: nickname, photoURL: null });
        this.firebaseAuth.auth.updateCurrentUser(this.u);
        var actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.
          url: 'http://localhost:4200/finishSignUp',
          // This must be true.
          handleCodeInApp: true,
        };

        this.firebaseAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings)
          .then(function () {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
          })
          .catch(function (error) {
            // Some error occurred, you can inspect the code: error.code
          });


        // const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = '400px';
        // dialogConfig.data = {
        //   ccNumber: cc,
        //   cvv: cvv,
        //   email: email,
        //   paypalPass: paypalPass
        // };

        // const dialogRef = this.dialog.open(UserCreatedDialogComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe(

        // );



        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  generatePassword() {
    var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  loginWithEmailLink() {
    // Confirm the link is a sign-in with email link.
    if (this.firebaseAuth
      .auth.isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.

      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      this.firebaseAuth
        .auth.signInWithEmailLink(email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          this.u = result.user;
          this.router.navigate(['/store']);

        })
        .catch(function (error) {
          console.log(error);
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }

  sendPasswordResetEmail() {
    var sent = this.firebaseAuth.auth.sendPasswordResetEmail(this.authState.email).then(function () {
      return true;
    }).catch(function (error) {
      // An error happened.
    });

    return sent;
  }

  login(email: string, password: string) {
    var signed = this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.u = value.user;
        if (value.user.emailVerified)
          return true;
        else
          return false;
      })
      .catch(err => {
        return err.message;
      });

    return signed;
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }
}