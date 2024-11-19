import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {}

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  checkAuthStatus() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  getCurrentUserName(): string | null {
    return this.auth.currentUser?.displayName || this.auth.currentUser?.email || null;
  }
}
