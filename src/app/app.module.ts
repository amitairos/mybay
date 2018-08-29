import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatFormFieldModule, MatCardModule, MatInputModule, MatRippleModule, MatRadioModule, MatSelectModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { SigninComponent } from './signin/signin.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { StoreComponent } from './store/store.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { ProductsService } from './services/products.service';
import { CartService } from './services/cart.service';
import { SumPipe } from './sum.pipe';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { CheckoutComponent } from './checkout/checkout.component';
import { AngularFirestoreModule } from '../../node_modules/angularfire2/firestore';
import { AuthGuardService } from './services/auth-guard.service';
import { UserCreatedDialogComponent } from './user-created-dialog/user-created-dialog.component';
import { UserProfileDialogComponent } from './user-profile-dialog/user-profile-dialog.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';

export const environment = {
  production: false,
  
  firebase: {
    apiKey: "AIzaSyAQGU7CILp02wdke1qCQMLApfpKJ4N9WGU",
    authDomain: "mybay-990af.firebaseapp.com",
    databaseURL: "https://mybay-990af.firebaseio.com",
    projectId: "mybay-990af",
    storageBucket: "mybay-990af.appspot.com",
    messagingSenderId: "30427379577"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    StoreComponent,
    ProductComponent,
    CartComponent,
    SumPipe,
    CheckoutComponent,
    UserCreatedDialogComponent,
    UserProfileDialogComponent,
    EmailVerifiedComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    MatRippleModule,
    HttpClientModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule
  ],
  entryComponents:[UserCreatedDialogComponent, UserProfileDialogComponent],
  providers: [AuthService, AuthGuardService, ProductsService, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
