import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { StoreComponent } from './store/store.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGuardService } from './services/auth-guard.service';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SigninComponent },
  { path: 'finishSignUp', component: EmailVerifiedComponent },
  { path: 'store', component: StoreComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService] },
  { path: 'history', component: PurchaseHistoryComponent, canActivate: [AuthGuardService] },
  { path: 'payments', component: PaymentHistoryComponent, canActivate: [AuthGuardService] },
  { path: 'products/:id', component: ProductComponent, canActivate: [AuthGuardService] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule { }