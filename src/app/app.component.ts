import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { UserProfileDialogComponent } from './user-profile-dialog/user-profile-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public authService: AuthService, private router: Router, private dialog: MatDialog) {

  }

  openCart() {
    this.router.navigate(['/cart'])
  }

  GoHome() {
    this.router.navigate(['/store']);
  }

  signout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openUserProfile() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(UserProfileDialogComponent, dialogConfig);
  }
}
