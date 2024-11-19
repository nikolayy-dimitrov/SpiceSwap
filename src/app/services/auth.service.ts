import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {}

  async register(email: string, password: string, name?: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, {displayName: name});
    }
    return userCredential;
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
    onAuthStateChanged(this.auth, (userId) => {
      this.userSubject.next(userId);
    });
  }

  getCurrentUserName(): string | null {
    return this.auth.currentUser?.displayName || this.auth.currentUser?.email || null;
  }

  getCurrentUserId() {
    return this.auth.currentUser?.uid || null;
  }
}
