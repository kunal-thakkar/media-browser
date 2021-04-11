import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filters } from './dashboard/dashboard.component';
import { Category } from './tmdb.service';

export enum StorageKeys {
  PreferenceKey = 'preferences',
  TmdbApiKey = "tmdbKey",
  MovieGenreKey = "movieGenreList",
  MovieCertificationsKey = "movieCertificationsList",
  DiscoverMovieFilters = "discoverMovieFilters",
  Configuration = "configuration",
  SearchHistory = "searchHistory"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  filtersSubject: BehaviorSubject<Filters[]> = new BehaviorSubject<Filters[]>([]);
  constructor() {}

  public read(key: string):any{
    return localStorage.getItem(key);
  }

  public readJSON(key: string):any{
    return JSON.parse(this.read(key));
  }

  private write(key: string, val: any){
    localStorage.setItem(key, val);
  }

  public writeJson(key: string, val: any){
    this.write(key, JSON.stringify(val));
  }

  private del(key: string){
    localStorage.removeItem(key);
  }

  setTmdbKey(key: string){
    this.write(StorageKeys.TmdbApiKey, key);
  }

  getTmdbKey(): string{
    return this.read(StorageKeys.TmdbApiKey);
  }

  addWatchedId(cat: Category, id: number){
    this.writeJson(`watched_${cat}`, (this.readJSON(`watched_${cat}`)||[]).concat(id));
  }

  getWatchedIds(cat: Category){
    return this.readJSON(`watched_${cat}`) || [];
  }

}
