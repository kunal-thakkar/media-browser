import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

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

  //Will be called before application starts
  _auth() {
    return new Promise((resolve, reject) => {
      if(this.auth.user) {
        this.auth.user.pipe(take(1)).subscribe(user => {
          this.user.next(user); 
          resolve(true);
        });
      }
      else {
        resolve(true);
      }
    });
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
