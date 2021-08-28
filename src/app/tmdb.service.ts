import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DiscoverOption } from './discover.option';
import { StorageService, StorageKeys } from './storage.service';
import { DiscoverResponse, Language, SelectOption } from './shared/model';
import { map } from 'rxjs/operators';

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

  sortOpt: SelectOption[] = [
    { value: "popularity.asc", text: "Popularity Asc" },
    { value: "popularity.desc", text: "Popularity Desc" },
    { value: "release_date.asc", text: "Release Date Asc" },
    { value: "release_date.desc", text: "Release Date Desc" },
    { value: "revenue.asc", text: "Revenue Asc" },
    { value: "revenue.desc", text: "Revenue Desc" },
    { value: "primary_release_date.asc", text: "Primary Release Date Asc" },
    { value: "primary_release_date.desc", text: "Primary Release Date Desc" },
    { value: "original_title.asc", text: "Original Title Asc" },
    { value: "original_title.desc", text: "Original Title Desc" },
    { value: "vote_average.asc", text: "Vote Average Asc" },
    { value: "vote_average.desc", text: "Vote Average Desc" },
    { value: "vote_count.asc", text: "Vote Count Asc" },
    { value: "vote_count.desc", text: "Vote Count Desc" }
  ];

  constructor(private http: HttpClient, private storage: StorageService) {
    this.apiKey = storage.getTmdbKey();
  }

  private addQueryCriteria(query: String[], key: String, val: String) {
    if (Array.isArray(val)) {
      query.push(`${key}=` + val.join("|"));
    }
    else if (typeof (val) == "number") {
      query.push(`${key}=${val}`);
    }
    else if (val.startsWith('<'))
      query.push(`${key}.lte=` + val.substr(1));
    else if (val.startsWith('>'))
      query.push(`${key}.gte=` + val.substr(1));
    else if (val.includes(':')) {
      let range = val.split(':');
      query.push(`${key}.gte=` + range[0]);
      query.push(`${key}.lte=` + range[1]);
    }
    else query.push(`${key}=${val}`);
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  setConfiguration(configuration: any) {
    this.configuration = configuration;
  }

  discover(c: Category, o: DiscoverOption): Observable<DiscoverResponse> {
    let query = ["api_key=" + this.apiKey];
    for (let k in o) {
      if (o.hasOwnProperty(k) && o[k]) this.addQueryCriteria(query, k, o[k]);
    }
    return this.http.get<DiscoverResponse>(`${this.tmdbBaseUrl}/discover/${c}?` + query.join("&"));
  }

  getGenreList(c: Category) {
    return this.http.get(`${this.tmdbBaseUrl}/genre/${c}/list?api_key=${this.apiKey}`);
  }

  getCertifications(c: Category) {
    return this.http.get(`${this.tmdbBaseUrl}/certification/${c}/list?api_key=${this.apiKey}`);
  }

  getInfo(c: Category, id: number): Observable<any> {
    return this.http.get(`${this.tmdbBaseUrl}/${c}/${id}?api_key=${this.apiKey}&append_to_response=credits,similar`);
  }

  getConfiguration(): Observable<any> {
    return this.http.get(`${this.tmdbBaseUrl}/configuration`, { params: { api_key: this.apiKey } });
  }

  getLanguages(): Observable<any> {
    return this.http
      .get(`${this.tmdbBaseUrl}/configuration/languages`, { params: { api_key: this.apiKey } })
      .pipe(map((d: Language[]) => d.sort((a, b) => a.english_name.localeCompare(b.english_name))));
  }

  getImgBaseUrl(size: number = 1): string {
    return this.configuration.images.secure_base_url + this.configuration.images.poster_sizes[size];
  }

  getCastInfo(id: number): Observable<any> {
    return this.http.get(`${this.tmdbBaseUrl}/person/${id}`, {
      params: {
        api_key: this.apiKey,
        append_to_response: 'combined_credits'
      }
    })
  }

  search(c: Category, query: string): Observable<any> {
    return this.http.get(`${this.tmdbBaseUrl}/search/${c}`, {
      params: {
        api_key: this.apiKey,
        query: query
      }
    });
  }

  getItems(cat: Category, opt: DiscoverOption): Observable<any> {
    opt.page = opt.page || 1;
    return this.discover(cat, opt);
  }

}
