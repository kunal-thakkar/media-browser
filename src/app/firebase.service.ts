import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  authSubscription: Subscription;
  user: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);

  constructor(private auth: AngularFireAuth) {
    if(this.auth.user) {
      this.authSubscription = this.auth.user.subscribe(user => {
        this.user.next(user);
      });
    }
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((userCredential: firebase.auth.UserCredential)=>{
      this.user.next(userCredential.user);
    });
  }

  logout() {
    if(this.authSubscription) this.authSubscription.unsubscribe();
    this.user.next(null);
    this.auth.signOut();
  }
}
