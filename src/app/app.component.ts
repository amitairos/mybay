import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialogConfig, MatDialog, MatIconRegistry } from '@angular/material';
import { UserProfileDialogComponent } from './user-profile-dialog/user-profile-dialog.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { CartService } from './services/cart.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService, private cartService: CartService,
    private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {
    this.matIconRegistry.addSvgIcon(
      "crown",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/crown.svg")
    );
  }

  ngOnInit(): void {
    
    // if (this.route.snapshot.queryParams.oobCode != null)
    //   this.authService.confirmEmail(this.route.snapshot.queryParams.oobCode).then(completed => {
    //     console.log('yay');
    //     console.log(completed);
    //   }).catch(error => console.log(error));
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
    this.cartService.clearProducts();
  }

  openPurchaseHistory() {
    this.router.navigate(['/history']);
  }

  openPaymentHistory() {
    this.router.navigate(['/payments']);
  }

  openAdminDashboard() {
    this.router.navigate(['/admin']);
  }

  openUserProfile() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(UserProfileDialogComponent, dialogConfig);
  }

  openAboutDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    this.dialog.open(AboutDialogComponent, dialogConfig);
  }
}
