import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkAuth();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.checkAuth();
  }

  canLoad(): Observable<boolean> {
    return this.checkAuth().pipe(
      map(result => typeof result === 'boolean' ? result : true)
    );
  }

  private checkAuth(): Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated && this.authService.isTokenValid()) {
      return of(true);
    }

    // If not authenticated, redirect to login
    return of(this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: this.router.url }
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated && this.authService.isAdmin) {
      return of(true);
    }

    // If not admin, redirect to home or show access denied
    return of(this.router.createUrlTree(['/']));
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerifiedGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated && this.authService.isEmailVerified) {
      return of(true);
    }

    // If email not verified, redirect to verification page
    return of(this.router.createUrlTree(['/verify-email']));
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (!this.authService.isAuthenticated) {
      return of(true);
    }

    // If already authenticated, redirect to home
    return of(this.router.createUrlTree(['/']));
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
} 
 
 