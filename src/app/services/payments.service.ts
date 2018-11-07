import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';

export class Payment {
  Expedinture: boolean;
  Amount: number;
  Date: Date;
  PaymentMethod?: string;
  CCNumber?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  myPayments: Payment[] = [];
  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.authService.user.subscribe(user => {
      if (user)
        this.db.collection('Users').doc(user.email).valueChanges().subscribe(data => {
          if ((data as any).PaymentHistory)
            this.myPayments = ((data as any).PaymentHistory as Payment[]).reverse();

          if (this.myPayments == null)
            this.myPayments = [];
        })
    })
  }

  addPayment(isExpedinture: boolean, Amount: number, Date: Date, PaymentMethod?: string, CCNumber?: number) {
    var payment: Payment = { Expedinture: isExpedinture, Amount: Amount, Date: Date };
    if (PaymentMethod)
      payment.PaymentMethod = PaymentMethod
    if (CCNumber)
      payment.CCNumber = CCNumber;

    this.myPayments.push(payment);

    return this.db.collection('Users').doc(this.authService.u.email).update({ PaymentHistory: this.myPayments });

  }
}
