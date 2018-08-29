import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm, FormControl, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  fullname: string;
  nickname: string;
  email: string;
  password: string;
  password_verify: string;
  show_login_error=false;
  login_error;

  pass_error;
  show_pass_error;

  showLogin = true;
  validate = false;

  showVerificationText=false;
  constructor(public authService: AuthService, private router: Router) { }
  matcher = new MyErrorStateMatcher();

  ngOnInit() {

  }

  signup(f: NgForm) {
    this.validate = true;
    if (f.form.valid) {
      var check = this.checkPwd(this.password);
      if (check != "ok") {
        this.show_pass_error = true;
        this.pass_error = check;
        return;
      }
      if(this.password!=this.password_verify) {
        this.show_pass_error = true;
        this.pass_error = 'Passwords do not match';
        return;
      }
      this.authService.signup(this.email, this.password, this.fullname, this.nickname);
      this.router.navigate(['/store']);
    }
    else {
    }
  }

  checkPwd(str) {
    if (str.length < 6) {
      return ("Password must be at least 6 characters long");
    } else if (str.search(/\d/) == -1) {
      return ("Password must contain both numbers and letters");
    } else if (str.search(/[a-zA-Z]/) == -1) {
      return ("Password must contain both numbers and letters");
    }
    return ("ok");
  }

  login() {
    var verified = this.authService.login(this.email, this.password).then(signed => {
      if(signed==false) {
        this.showVerificationText=true;
      }
      else if(signed==true){
        this.router.navigate(['/store']);
      }
      else {
        this.show_login_error=true;
        this.login_error=signed;
      }
      
    });
    if(!verified) {
      
    }
  }

  logout() {
    this.authService.logout();
  }

}
