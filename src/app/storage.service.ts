import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import firebase from "node_modules/firebase";
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, take } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { MediaList, Genre, Media, KodiExportMovie, StorageData } from './shared/model';
import { UploadMetadata } from '@angular/fire/storage/interfaces';

export enum StorageKeys {
  PreferenceKey = 'preferences',
  TmdbApiKey = "tmdbKey",
  MovieGenreKey = "movieGenreList",
  MovieCertificationsKey = "movieCertificationsList",
  DiscoverMovieFilters = "discoverMovieFilters",
  Configuration = "configuration",
  SearchHistory = "searchHistory",
  Languages = "languages",
  MediaCollection = "collection",
  DashboardFilters = "dashboardFilters"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  filtersSubject: BehaviorSubject<MediaList[]> = new BehaviorSubject<MediaList[]>([]);
  movieFilters: MediaList[] = [];
  customFilterMediaIds: number[] = [];
  genres: Genre[];
  user: firebase.User;

  constructor(private firebaseService: FirebaseService, private fireStorage: AngularFireStorage,
    private http: HttpClient) {
    firebaseService.user.subscribe(user => {
      this.user = user;
      if (user != null) {
        const ref: AngularFireStorageReference = this.fireStorage.ref(this.user.email + "/" + StorageKeys.DiscoverMovieFilters);
        ref.getMetadata().subscribe((metadata: UploadMetadata) => {
          const storeMediaList = this.readJSON(StorageKeys.DiscoverMovieFilters);
          if (!storeMediaList || !storeMediaList.metadata || storeMediaList.metadata.md5Hash != metadata.md5Hash) {
            ref.getDownloadURL().pipe(mergeMap(url => this.http.get(url)))
              .subscribe((obj: MediaList[]) => {
                this.writeJson(StorageKeys.DiscoverMovieFilters, { metadata: metadata, data: obj });
                this.setMediaList(obj);
              });
          }
        })
      }
      else {
        let storeMediaList = this.readJSON(StorageKeys.DiscoverMovieFilters) || { metadata: { md5Hash: '' }, data: [] };
        this.setMediaList(storeMediaList.data);
      }
    });
  }

  private setMediaList(list: MediaList[]) {
    this.movieFilters = list || [];
    this.filtersSubject.next(list);
    this.customFilterMediaIds = [];
    (list || [])
      .filter(filter => filter.isCustom)
      .forEach(f => this.customFilterMediaIds.push(...f.items.filter(i => i != null).map(i => i.id)));
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
      let _val: MediaList[] = val.data.map(i => {
        let _i: MediaList = Object.assign({}, i);
        _i.items = (i.isCustom === undefined || i.isCustom !== true) ? [] : _i.items;
        return _i;
      });
      if (this.user) {
        var jsonString = JSON.stringify(_val);
        var blob = new Blob([jsonString], { type: "application/json" })
        this.fireStorage.ref(this.user.email + "/" + key).put(blob);
        this.write(key, JSON.stringify({ metadata: val.metadata, data: _val }));
      }
      else {
        this.write(key, JSON.stringify({ metadata: { md5Hash: '' }, data: _val }));
      }
      this.filtersSubject.next(val.data);
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
    this.writeJson(StorageKeys.DiscoverMovieFilters, { metadata: null, data: this.movieFilters });
  }

  mapKodiExportToMedia = (movie: KodiExportMovie[]) => movie.map((element: KodiExportMovie) => ({
    genre_ids: element.genre.map(gener => +this.genres.filter(g => g.name === gener)[0].id),
    id: +(element.uniqueid ? element.uniqueid.filter(u => u.type === 'tmdb')[0].text : element.id),
    poster_path: element.art.poster,
    title: element.title,
    original_title: element.originaltitle,
    release_date: element.premiered,
    popularity: +element.ratings.filter(r => r.name === 'imdb')[0].value,
    vote_count: +element.ratings.filter(r => r.name === 'imdb')[0].votes
  }));


  getCollection(): Observable<Media[]> {
    const ref: AngularFireStorageReference = this.fireStorage.ref(this.user.email + "/" + StorageKeys.MediaCollection)
    return ref.getMetadata()
      .pipe(mergeMap((metadata: UploadMetadata) => {
        let myCollection = this.readJSON(StorageKeys.MediaCollection);
        if (!myCollection || myCollection.metadata.md5Hash !== metadata.md5Hash)
          return ref.getDownloadURL().pipe(mergeMap(url => this.http.get(url)
            .pipe(map((obj: { movie: KodiExportMovie[] }) => {
              this.writeJson(StorageKeys.MediaCollection, {
                metadata: metadata,
                data: obj
              })
              return this.mapKodiExportToMedia(obj.movie);
            }))
          ));
        else
          return [this.mapKodiExportToMedia(myCollection.data.movie)];
      }));
  }
}
