import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../services/payments.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  constructor(public paymentsService: PaymentsService, private authService: AuthService) { }

  ngOnInit() {
  }

}
