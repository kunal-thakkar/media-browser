import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'node_modules/firebase'
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: firebase.User;

  navList = [
    { "icon": "home", "text": "Home", "routerLink": "/" },
    { "icon": "settings", "text": "Settings", "routerLink": "/settings"}
  ];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.user.subscribe(user => {
      this.user = user;
    });
  }
  
  login() {
    this.firebaseService.login();
  }

  logout() {
    this.firebaseService.logout();
  }
}

