import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  navList = [
    { "icon": "home", "text": "Home", "routerLink": "/" },
    { "icon": "settings", "text": "Settings", "routerLink": "/settings"}
  ];

  constructor(public auth: AngularFireAuth) { }

  ngOnInit() {
  }
  
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.auth.signOut();
  }
}

