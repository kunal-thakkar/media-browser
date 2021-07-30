import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from "node_modules/firebase";
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { MediaList, Genre } from './shared/model';

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

  filtersSubject: BehaviorSubject<MediaList[]> = new BehaviorSubject<MediaList[]>([]);
  movieFilters: MediaList[] = [];
  customFilterMediaIds: number[] = [];
  genres: Genre[];
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
            this.http.get(url).subscribe((obj: MediaList[]) => {
              this.filtersSubject.next(obj);
              this.movieFilters = obj || [];
              this.customFilterMediaIds = [];
              (obj || [])
                .filter(filter => filter.isCustom)
                .forEach(f => this.customFilterMediaIds.push(...f.items.filter(i => i != null).map(i => i.id)));
            });
          });
      }
      else {
        this.movieFilters = this.readJSON(StorageKeys.DiscoverMovieFilters) || [];
        this.filtersSubject.next(this.movieFilters);
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
      let _val: MediaList[] = val.map(i => {
        let _i: MediaList = Object.assign({}, i);
        ["index", "totalPages"].forEach(k => delete _i[k])
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
      if (key == StorageKeys.MovieGenreKey) {
        this.genres = val["genres"] || [];
      }
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

  moveMovieItem(title: string, item: any) {
    let filter: MediaList[] = this.movieFilters.filter((f: MediaList) => f.title === title);
    if (filter.length > 0) {
      if (filter[0].items.filter(i => i.id === item.id).length === 0) {
        filter[0].items.push(item);
      }
    }
    else {
      this.movieFilters.push({
        title: title,
        isCustom: true,
        items: [item]
      });
    }
    this.writeJson(StorageKeys.DiscoverMovieFilters, this.movieFilters);
  }

}
