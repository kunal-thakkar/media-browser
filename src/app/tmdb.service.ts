import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DiscoverOption } from './discover.option';
import { StorageService, StorageKeys } from './storage.service';

export enum Category {
  Movie = "movie", TvShows = "tv"
}

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  tmdbBaseUrl = "https://api.themoviedb.org/3";
  configuration: any;
  apiKey = "";

  constructor(private http: HttpClient, private storage: StorageService) {
    this.apiKey = storage.getTmdbKey();
  }

  private addQueryCriteria(query: String[], key: String, val: String){
    if(Array.isArray(val)){
      query.push(`${key}=`+val.join("|"));
    }
    else if(typeof(val) == "number"){
      query.push(`${key}=${val}`);
    }
    else if(val.startsWith('<')) 
      query.push(`${key}.lte=`+val.substr(1));
    else if(val.startsWith('>')) 
      query.push(`${key}.gte=`+val.substr(1));
    else if(val.includes(':')){
      let range = val.split(':');
      query.push(`${key}.gte=`+range[0]);
      query.push(`${key}.lte=`+range[1]);
    }
    else query.push(`${key}=${val}`);
  }

  setApiKey(key: string){
    this.apiKey = key;
  }

  setConfiguration(configuration: any){
    this.configuration = configuration;
  }

  discover(c: Category, o: DiscoverOption): Observable<any>{
    let query = ["api_key="+this.apiKey];
    for(let k in o){
      if(o.hasOwnProperty(k) && o[k]) this.addQueryCriteria(query, k, o[k]);
    }
    return this.http.get(`${this.tmdbBaseUrl}/discover/${c}?`+query.join("&"));
  }

  getGenreList(c: Category){
    return this.http.get(`${this.tmdbBaseUrl}/genre/${c}/list?api_key=${this.apiKey}`);
  }

  getCertifications(c: Category){
    return this.http.get(`${this.tmdbBaseUrl}/certification/${c}/list?api_key=${this.apiKey}`);
  }

  getInfo(c: Category, id: number): Observable<any>{
    return this.http.get(`${this.tmdbBaseUrl}/${c}/${id}?api_key=${this.apiKey}&append_to_response=credits,similar`);
  }

  getConfiguration():Observable<any>{
    return this.http.get(`${this.tmdbBaseUrl}/configuration`, { params: {api_key: this.apiKey}});
  }

  getImgBaseUrl(size: number = 1): string{
    return this.configuration.images.secure_base_url + this.configuration.images.poster_sizes[size];
  }

  getCastInfo(id: number): Observable<any>{
    return this.http.get(`${this.tmdbBaseUrl}/person/${id}`, {params:{
      api_key: this.apiKey,
      append_to_response: 'combined_credits'
    }})
  }

}
