import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Option } from './discover.option';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  tmdbBaseUrl = "https://api.themoviedb.org/3";
  api_key = "";

  constructor(private http: HttpClient) { }

  configuration(): Observable<any>{
    return this.http.get(`${this.tmdbBaseUrl}/configuration?api_key=${this.api_key}`);
  }

  private addQueryCriteria(query: String[], key: String, val: String){
    if(val.startsWith('<')) 
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

  discoverMovie(o: Option): Observable<any>{
    let query = ["api_key="+this.api_key];
    if (o.lang) query.push("with_original_language="+o.lang);
    if (o.sort_by) query.push('sort_by='+o.sort_by);
    if (o.certification_country) query.push('certification_country='+o.certification_country);
    if (o.certification) this.addQueryCriteria(query, 'certification', o.certification);
    if (o.primary_release_date) this.addQueryCriteria(query, 'primary_release_date', o.primary_release_date);
    if (o.primary_release_year) query.push('primary_release_year='+ o.primary_release_year);
    return this.http.get(`${this.tmdbBaseUrl}/discover/movie?`+query.join("&"));
  }


}
