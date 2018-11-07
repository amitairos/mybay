import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.css']
})
export class EmailVerifiedComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.sendPaymentMethod(this.authService.authState.email);
    this.router.navigate(['/login']);
  }


}
