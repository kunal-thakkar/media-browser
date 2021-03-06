import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filters } from './dashboard/dashboard.component';
import { Category } from './tmdb.service';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from "node_modules/firebase";
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

export enum StorageKeys {
  PreferenceKey = 'preferences',
  TmdbApiKey = "tmdbKey",
  MovieGenreKey = "movieGenreList",
  MovieCertificationsKey = "movieCertificationsList",
  DiscoverMovieFilters = "discoverMovieFilters",
  Configuration = "configuration",
  SearchHistory = "searchHistory",
  Languages = "languages"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  filtersSubject: BehaviorSubject<Filters[]> = new BehaviorSubject<Filters[]>([]);
  movieFilters: Filters[] = [];
  private user: firebase.User;

  constructor(private firebaseService: FirebaseService, private fireStorage: AngularFireStorage,
    private http: HttpClient) {
    firebaseService.user.subscribe(user => {
      this.user = user;
      if (user != null) {
        this.fireStorage.ref(this.user.email + "/" + StorageKeys.DiscoverMovieFilters)
          .getDownloadURL()
          .pipe(take(1))
          .subscribe(url => {
            this.http.get(url).subscribe((obj: Filters[]) => {
              this.filtersSubject.next(obj);
              this.movieFilters = obj || [];
            });
          });
      }
      else {
        this.filtersSubject.next(this.readJSON(StorageKeys.DiscoverMovieFilters));
      }
    });
  }

  public read(key: string): any {
    return localStorage.getItem(key);
  }

  public readJSON(key: string): any {
    return JSON.parse(this.read(key));
  }

  private write(key: string, val: any) {
    localStorage.setItem(key, val);
  }

  public writeJson(key: string, val: any) {
    if (key == StorageKeys.DiscoverMovieFilters) {
      let _val: Filters[] = val.map(i => {
        let _i: Filters = Object.assign({}, i);
        ["index", "totalPages", "isLoading"].forEach(k => delete _i[k])
        return _i;
      });
      _val.filter(i => (i.isCustom === undefined || i.isCustom !== true)).map(i => i.items = []);
      if (this.user) {
        var jsonString = JSON.stringify(_val);
        var blob = new Blob([jsonString], { type: "application/json" })
        this.fireStorage.ref(this.user.email + "/" + key).put(blob);
      }
      else {
        this.write(key, JSON.stringify(_val));
      }
      this.filtersSubject.next(val);
    }
    else {
      this.write(key, JSON.stringify(val));
    }
  }

  private del(key: string) {
    localStorage.removeItem(key);
  }

  setTmdbKey(key: string) {
    this.write(StorageKeys.TmdbApiKey, key);
  }

  getTmdbKey(): string {
    return this.read(StorageKeys.TmdbApiKey);
  }


}
