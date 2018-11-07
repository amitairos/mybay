import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { UserCreatedDialogComponent } from '../user-created-dialog/user-created-dialog.component';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';

@Injectable()
export class AuthService {
  authState: any = null;
  public user: Observable<firebase.User>;
  u: firebase.User;
  isAdmin: boolean = false;

  constructor(private db: AngularFirestore, private firebaseAuth: AngularFireAuth, private router: Router,
    private dialog: MatDialog, private http: HttpClient) {
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

  signup(email: string, password: string, firstname: string, lastname, nickname: string, address: string) {
    var cc = Math.floor(Math.random() * 10000000000000000);
    var cvv = Math.floor(Math.random() * 1000);
    var date = new Date(2025, 1, 1);
    var paypalPass = this.generatePassword();

    this.db.collection('Users').doc(email).set({ FirstName: firstname, LastName: lastname, CreditCard: cc, Cvv: cvv, Date: date, PayPalPassword: paypalPass, Address: address });

    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.u = value.user;
        this.u.updateProfile({ displayName: nickname, photoURL: null });
        this.firebaseAuth.auth.updateCurrentUser(this.u);

        var actionCodeSettings = {
          // url: 'http://localhost:4200/finishSignUp/?email=' + this.u.email,
          url: 'https://mybay-990af.firebaseapp.com/finishSignUp/?email=' + this.u.email,
          handleCodeInApp: true,
        };
        value.user.sendEmailVerification(actionCodeSettings);
        // var actionCodeSettings = {
        //   // URL you want to redirect back to. The domain (www.example.com) for this
        //   // URL must be whitelisted in the Firebase Console.
        //   //url: 'http://localhost:4200/finishSignUp',
        //   url: 'https://mybay-990af.firebaseapp.com/finishSignUp',
        //   // This must be true.
        //   handleCodeInApp: true,
        // };


        // this.firebaseAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings)
        //   .then(function () {
        //     // The link was successfully sent. Inform the user.
        //     // Save the email locally so you don't need to ask the user for it again
        //     // if they open the link on the same device.
        //     window.localStorage.setItem('emailForSignIn', email);
        //   })
        //   .catch(function (error) {
        //     // Some error occurred, you can inspect the code: error.code
        //   });


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

  confirmEmail(oobCode) {
    // return this.firebaseAuth.auth.applyActionCode(oobCode)
    //   .then(() => {
    //     console.log('yay');
    //     //this.u = this.firebaseAuth.auth.currentUser;
    //     //console.log(this.firebaseAuth.auth.currentUser);
    //     // this.sendPaymentMethod(this.u.email).then(sent => {
    //     //   console.log('sent');
    //     //   this.router.navigate(['/login'])
    //     // });
    //   }
    //   ).catch(error => console.log(error));

    // // Confirm the link is a sign-in with email link.
    // if (this.firebaseAuth
    //   .auth.isSignInWithEmailLink(window.location.href)) {
    //   // Additional state parameters can also be passed via URL.
    //   // This can be used to continue the user's intended action before triggering
    //   // the sign-in operation.
    //   // Get the email if available. This should be available if the user completes
    //   // the flow on the same device where they started it.

    //   var email = window.localStorage.getItem('emailForSignIn');
    //   if (!email) {
    //     // User opened the link on a different device. To prevent session fixation
    //     // attacks, ask the user to provide the associated email again. For example:
    //     email = window.prompt('Please provide your email for confirmation');
    //   }
    //   // The client SDK will parse the code from the link for you.
    //   this.firebaseAuth
    //     .auth.signInWithEmailLink(email, window.location.href)
    //     .then((result) => {
    //       // Clear email from storage.
    //       window.localStorage.removeItem('emailForSignIn');
    //       // You can access the new user via result.user
    //       // Additional user info profile not available via:
    //       // result.additionalUserInfo.profile == null
    //       // You can check if the user is new or existing:
    //       // result.additionalUserInfo.isNewUser
    //       this.u = result.user;
    //       this.sendPaymentMethod(email).then(sent => {
    //         this.router.navigate(['/store'])
    //       });

    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //       // Some error occurred, you can inspect the code: error.code
    //       // Common errors could be invalid email and invalid or expired OTPs.
    //     });
    // }
  }

  sendPaymentMethod(email) {
    const options = { headers: { 'Content-Type': 'application/json' } };
    var sent = this.db.collection('Users').doc(email).ref.get().then(data => {
      var first = data.data().FirstName;
      var last = data.data().LastName;
      var cc = data.data().CreditCard
      var cvv = data.data().Cvv
      var date = data.data().Date
      var paypalpass = data.data().PayPalPassword;

      var subject = "MyBay Payment Methods"
      var body = "Hi " + first + " " + last + "<br/><br/>";
      body += `Welcome to MyBay!<br/><br/>Here are your payment methods. Please keep them safe:<br/><br/>
      <b>Credit Card number:</b> ${cc}<br/>
      <b>Credit Card CVV:</b> ${cvv}<br/>
      <b>Credit Card expiration date:</b> ${(date.toDate() as Date).getMonth()}/${(date.toDate() as Date).getUTCFullYear()}<br/><br/>
      <b>PayPal E-mail:</b> ${email}<br/>
      <b>PayPal Password:</b> ${paypalpass}<br/><br/>

      <img src="https://mybay-990af.firebaseapp.com/assets/myBay.png" style=' height: auto;
      width: auto;
      max-height: 100px;
      max-width: 150px;
      object-fit: cover;'/>
      `
      return this.http.post('https://mybay.herokuapp.com/email', JSON.stringify({ email: email, subject: subject, body: body }), options).subscribe(res => {
        return true;
      })
    });
    return sent;

  }

  sendNewPaymentMethod(email) {
    const options = { headers: { 'Content-Type': 'application/json' } };
    var cc = Math.floor(Math.random() * 10000000000000000);
    var cvv = Math.floor(Math.random() * 1000);
    var date = new Date(2025, 1, 1);
    var paypalPass = this.generatePassword();

    return this.db.collection('Users').doc(email).update({ CreditCard: cc, Cvv: cvv, Date: date, PayPalPassword: paypalPass }).then(() => {
      return this.db.collection('Users').doc(email).ref.get().then(data => {
        var first = data.data().FirstName;
        var last = data.data().LastName;

        var subject = "MyBay Payment New Methods"
        var body = "Hi " + first + " " + last + "<br/><br/>";
        body += `Here are your new payment methods. Please keep them safe:<br/><br/>
      <b>Credit Card number:</b> ${cc}<br/>
      <b>Credit Card CVV:</b> ${cvv}<br/>
      <b>Credit Card expiration date:</b> ${date.getMonth()}/${date.getUTCFullYear()}<br/><br/>
      <b>PayPal E-mail:</b> ${email}<br/>
      <b>PayPal Password:</b> ${paypalPass}<br/><br/>

      <img src="https://mybay-990af.firebaseapp.com/assets/myBay.png" style=' height: auto;
      width: auto;
      max-height: 100px;
      max-width: 150px;
      object-fit: cover;'/>
      `
        return this.http.post('https://mybay.herokuapp.com/email', JSON.stringify({ email: email, subject: subject, body: body }), options).subscribe(res => {
          return true;
        })
      });

    });
  }


  sendPasswordResetEmail() {
    var sent = this.firebaseAuth.auth.sendPasswordResetEmail(this.authState.email).then(function () {
      return true;
    }).catch(function (error) {
      // An error happened.
    });

    return sent;
  }

  sendPasswordResetEmailToMail(email) {
    var sent = this.firebaseAuth.auth.sendPasswordResetEmail(email).then(function () {
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
        console.log('Oh yes')
        this.u = value.user;

        this.db.collection('Users').doc(email).ref.get().then(data => {
          this.isAdmin = data.data().isAdmin;
        });

        return true;
        // if (value.user.emailVerified)
        //   return true;
        // else
        //   return false;
      })
      .catch(err => {
        console.log('Oh no')
        console.log(err);
        return err.message;
      });

    return signed;
  }

  loginwithFB() {
    var provider = new firebase.auth.FacebookAuthProvider();
    return this.firebaseAuth.auth.signInWithPopup(provider).then(function (result) {
      // The signed-in user info.
      console.log('in');
      console.log(result);
      this.u = result.user;

      return firebase.auth().signInWithRedirect(provider).then(signed => {
        console.log('in in');
        console.log(signed);
        return true;
      });

      // ...
    }).catch(function (error) {
      console.log('out');
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();


    this.authState = null;
  }
}