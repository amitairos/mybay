import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router, private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if ((this.authService.authState !== null)) {
            //this.router.navigate(['/main']);
            //console.log('yip');
            return true;
        }
        else {
            this.router.navigate(['/login'], { skipLocationChange: true });
            return false;
        }
    }

}