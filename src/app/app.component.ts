import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
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
    { "icon": "list", "text": "Watchlist", "routerLink": "/watchlist" },
    // { "icon": "settings", "text": "Settings", "routerLink": "/settings" }
  ];

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.firebaseService.user.subscribe(user => {
      this.user = user;
      if (user) {
        this.navList.splice(2, 0, { "icon": "folder", "text": "My Collection", "routerLink": "/collection" });
      }
      else {
        this.navList.splice(2, 1);
      }
    });
  }

  login() {
    this.firebaseService.login();
  }

  logout() {
    this.firebaseService.logout();
    this.router.navigate(["/"]);
  }
}

