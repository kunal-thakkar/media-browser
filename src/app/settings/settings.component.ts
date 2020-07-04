import { Component, OnInit } from '@angular/core';
import { StorageService, StorageKeys } from '../storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from "@angular/forms";
import { TmdbService } from '../tmdb.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router, private storage: StorageService, private fb: FormBuilder, private service: TmdbService) { }

  Object = Object;
  tmdbKey: string = this.storage.read(StorageKeys.TmdbApiKey);
  sortBy = {
    "popularity.asc": "Popularity Asc", 
    "popularity.desc": "Popularity Desc", 
    "release_date.asc": "Release Date Asc", 
    "release_date.desc": "Release Date Desc", 
    "revenue.asc": "Revenue Asc", 
    "revenue.desc": "Revenue Desc", 
    "primary_release_date.asc": "Primary Release Date Asc", 
    "primary_release_date.desc": "Primary Release Date Desc", 
    "original_title.asc": "Original Title Asc", 
    "original_title.desc": "Original Title Desc", 
    "vote_average.asc": "Vote Average Asc", 
    "vote_average.desc": "Vote Average Desc",
    "vote_count.asc": "Vote Count Asc", 
    "vote_count.desc": "Vote Count Desc"
  };
  certifications = this.storage.readJSON(StorageKeys.MovieCertificationsKey);
  genres = this.storage.readJSON(StorageKeys.MovieGenreKey);
  langOpt = {
    "hi":"Hindi",
    "en":"English"
  };

  fg: FormGroup = this.fb.group({
    '_title':[],
    'certification_country': [],
    'certification': [],
    'primary_release_date.gte': [],
    'primary_release_date.lte': [],
    'with_genres': [],
    'with_original_language':[],
    'sort_by':[]
  });

  formFields = [
    {"key":"_title", "label":"Filter title", "type":"text"},
    {"key":"certification_country", "label":"Certification Country", "type":"choice", "set":Object.keys(this.certifications||{})},
    {"key":"certification", "label":"Certification", "type":"multi-choice", "set":[]},
    {"key":"primary_release_date.gte", "label":"Release Date Grater or Equal", "type":"date"},
    {"key":"primary_release_date.lte", "label":"Release Date Less or Equal", "type":"date"},
    {"key":"with_genres", "label":"Genres", "type":"multi-choice", "set":this.storage.readJSON(StorageKeys.MovieGenreKey)||[]},
    {"key":"with_original_language", "label":"Language", "type":"choice", "set":this.langOpt},
    {"key":"sort_by", "label":"Sort By", "type":"choice", "set":this.sortBy},
  ];

  discoverMovieFilters: Object[] = this.storage.readJSON(StorageKeys.DiscoverMovieFilters) || [];

  removeFilter(idx){
    this.discoverMovieFilters.splice(idx, 1);
  }

  updateForm(){
    let val: Object = this.fg.getRawValue();
    if(val['certification_country'] && !val['certification']){
      this.formFields[2].set = this.certifications[val['certification_country']];
    }
  }

  addFilter(){
    this.discoverMovieFilters.push(this.fg.getRawValue());
  }

  isArray(v):boolean{
    return Array.isArray(v);
  }
  
  ngOnInit() {
  }

  saveSettings(){
    this.storage.setTmdbKey(this.tmdbKey);
    this.service.setApiKey(this.tmdbKey);
    this.storage.writeJson(StorageKeys.DiscoverMovieFilters, this.discoverMovieFilters.filter(e=>e!=null));
    this.router.navigate(['/dashboard']);
  }
}
