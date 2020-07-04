import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService, StorageKeys } from './storage.service';
import { TmdbService, Category } from './tmdb.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class TmdbConfigProvider {

  constructor(private http: HttpClient, private storage: StorageService, private service: TmdbService) {
  }

  //Will be called before application starts
  load() {
    return new Promise((resolve, reject) => {
      this.service.setApiKey(this.storage.getTmdbKey());
      forkJoin([
        this.service.getConfiguration(),
        this.service.getGenreList(Category.Movie),
        this.service.getCertifications(Category.Movie)
      ]).subscribe(data => {
        this.service.setConfiguration(data[0]);
        this.storage.writeJson(StorageKeys.Configuration, data[0]);
        let genres = {};
        data[1]["genres"].forEach(e => {
          genres[e.id] = e.name;
        });
        this.storage.writeJson(StorageKeys.MovieGenreKey, genres);
        let certifications = {};
        for(let k in data[1]["certifications"]){
          let certs = {};
          data["certifications"][k].forEach(e => {
            certs[e["certification"]] = e["certification"];
          });
          certifications[k] = certs;
        }
        this.storage.writeJson(StorageKeys.MovieCertificationsKey, certifications);
        resolve(true);
      });
    });
  }

}