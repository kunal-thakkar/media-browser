import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { TmdbService } from './tmdb.service';

@Injectable()
export class IsInitComplete {
  constructor(
    private router: Router, 
    private storage: StorageService,
    private tmdbService: TmdbService) {
  }

  resolve(): void {
    if (!this.storage.getTmdbKey()){
      this.router.navigate(['/settings'])
    }
  }
}