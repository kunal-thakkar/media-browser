import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService, StorageKeys } from './storage.service';
import { TmdbService, Category } from './tmdb.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TmdbConfigProvider {

  constructor(private http: HttpClient, private storage: StorageService, private service: TmdbService) {
  }

  //Will be called before application starts
  load() {
    return new Promise((resolve, reject) => {
      this.service.setApiKey(environment.tmdbKey);
      forkJoin([
        this.service.getConfiguration(),
        this.service.getGenreList(Category.Movie),
        this.service.getCertifications(Category.Movie),
        this.service.getLanguages()
      ]).subscribe(data => {
        this.service.setConfiguration(data[0]);
        this.storage.writeJson(StorageKeys.Configuration, data[0]);
        let genres = {};
        data[1]["genres"].forEach(e => {
          genres[e.id] = e.name;
        });
        this.storage.writeJson(StorageKeys.MovieGenreKey, genres);
        let certifications = {};
        for (let k in data[2]["certifications"]) {
          let certs = {};
          data[2]["certifications"][k].forEach(e => {
            certs[e["certification"]] = e["certification"];
          });
          certifications[k] = certs;
        }
        this.storage.writeJson(StorageKeys.MovieCertificationsKey, certifications);
        let languages = {};
        data[3].forEach(e => {
          languages[e["iso_639_1"]] = e["english_name"];
        });
        this.storage.writeJson(StorageKeys.Languages, languages);
        resolve(true);
      });
    });
  }

}