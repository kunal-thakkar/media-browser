import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleSearchResult, TorrentResult } from './shared/model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  authSubscription: Subscription;
  user: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);

  constructor(private auth: AngularFireAuth, private http: HttpClient) { }

  //Will be called before application starts
  _auth() {
    return new Promise((resolve, reject) => {
      if (this.auth.user) {
        this.auth.user.subscribe(user => {
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
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    this.user.next(null);
    this.auth.signOut();
  }

  search(q: string, start: number): Observable<any> {
    return this.http.get("https://customsearch.googleapis.com/customsearch/v1", {
      params: {
        key: environment.firebase.apiKey,
        cx: '1c071add967e41c16',
        // q: `\"${q}\"`
        exactTerms: q,
        start: "" + (start || 1),
        gl: 'in',
        // cr: 'countryIN',
        filter: "1",
        lr: "lang_en"
      }
    }).pipe(map((result: GoogleSearchResult) => {
      result.items.forEach(item => {
        if (item.displayLink === 'www.primevideo.com') {
          item.link = `https://www.primevideo.com/search?phrase=${q.replace(/\s/g, '+')}`
        }
      });
      result.items = [
        ...new Map(
          result.items.map(item => [item.link, item])
        ).values()
      ];
      return result;
    }));
  }

  searchTorrent(q: string): Observable<TorrentResult[]> {
    return this.http.get<TorrentResult[]>('https://b0xxfgl66m.execute-api.us-east-1.amazonaws.com/torrent/torrent-finder', {
      params: { q: q },
      headers: { 'x-api-id': environment.firebase.apiKey }
    });
  }
}
