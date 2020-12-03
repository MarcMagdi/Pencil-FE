import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public readonly loaded$: Observable<boolean> = this.loaded.asObservable();

  constructor(
    public angularFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.angularFireAuth.authState.subscribe((user) => {
      this.SetUser(user);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false;
  }

  get user(): any {
    return this.userData;
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  AuthLogin(provider) {
    return this.angularFireAuth.signInWithPopup(provider).then((result) => {
      return this.ngZone.run(() => {
        this.SetUser(result.user);
        return this.router.navigate(['editor']);
      });
    });
  }

  SignOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.userData = null;
      return this.router.navigate(['login']);
    });
  }

  SetUser(user) {
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(this.userData));
    this.loaded.next(true);
  }
}
