import { Injectable } from '@angular/core';
import { Preferences } from './models/preference.model';
import { Router } from '@angular/router';
import { TmdbService, Category } from './tmdb.service';

export enum StorageKeys {
  PreferenceKey = 'preferences',
  TmdbApiKey = "tmdbKey",
  MovieGenreKey = "movieGenreList",
  MovieCertificationsKey = "movieCertificationsList",
  DiscoverMovieFilters = "discoverMovieFilters"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor(private router: Router, private tmdbService: TmdbService) { 
    console.log("Storage service initialize")
    this.tmdbService.setApiKey(this.getTmdbKey());
  }

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
    this.tmdbService.setApiKey(key);
    this.tmdbService.getGenreList(Category.Movie).subscribe(data=>{
      let genres = {};
      data["genres"].forEach(e => {
        genres[e.id] = e.name;
      });
      this.write(StorageKeys.MovieGenreKey, JSON.stringify(genres));
    });
    this.tmdbService.getCertifications(Category.Movie).subscribe(data=>{
      let certifications = {};
      for(let k in data["certifications"]){
        let certs = {};
        data["certifications"][k].forEach(e => {
          certs[e["certification"]] = e["certification"];
        });
        certifications[k] = certs;
      }
      this.write(StorageKeys.MovieCertificationsKey, JSON.stringify(certifications));
    });
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

}
