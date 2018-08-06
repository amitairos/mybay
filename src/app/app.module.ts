import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatFormFieldModule, MatCardModule, MatInputModule } from '@angular/material';
import { SigninComponent } from './signin/signin.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '../../node_modules/@angular/forms';
import { StoreComponent } from './store/store.component';

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
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
