import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  email: string;
  password: string;
  showLogin = true;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  signup() {
    this.authService.signup(this.email, this.password);
    
    this.router.navigate(['/store']);
  }

  login() {
    this.authService.login(this.email, this.password);
    
    this.router.navigate(['/store']);
  }

  logout() {
    this.authService.logout();
  }

}
