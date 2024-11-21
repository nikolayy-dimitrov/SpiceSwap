import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from "rxjs";
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        if (!user) {
          return true;
        } else {
          this.router.navigate(['/dashboard']);
          return false;
        }
      })
    );
  }
}
