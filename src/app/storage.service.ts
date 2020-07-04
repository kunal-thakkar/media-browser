import { Injectable } from '@angular/core';
import { Preferences } from './models/preference.model';
import { Category } from './tmdb.service';

export enum StorageKeys {
  PreferenceKey = 'preferences',
  TmdbApiKey = "tmdbKey",
  MovieGenreKey = "movieGenreList",
  MovieCertificationsKey = "movieCertificationsList",
  DiscoverMovieFilters = "discoverMovieFilters",
  Configuration = "configuration"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {


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

  loadPreferences():Preferences{
    let _p = this.read(StorageKeys.PreferenceKey);
    return _p ? JSON.parse(_p) : new Preferences();
  }

  savePreferences(p: Preferences){
    this.write(StorageKeys.PreferenceKey, JSON.stringify(p));
  }

  addWatchedId(cat: Category, id: number){
    this.writeJson(`watched_${cat}`, (this.readJSON(`watched_${cat}`)||[]).concat(id));
  }

  getWatchedIds(cat: Category){
    return this.readJSON(`watched_${cat}`) || [];
  }

}
