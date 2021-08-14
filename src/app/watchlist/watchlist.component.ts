import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MediaList } from '../shared/model';
import { StorageKeys, StorageService } from '../storage.service';
import { Category, TmdbService } from '../tmdb.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  filters: MediaList[];

  constructor(private tmdbService: TmdbService, private storage: StorageService,
    private analytics: AngularFireAnalytics) { }

  ngOnInit(): void {
    this.analytics.logEvent('Watchlist loaded');
    this.storage.filtersSubject.subscribe((movieFilters: MediaList[]) => {
      this.filters = movieFilters;
    });
  }

  removeCat(i: number) {
    this.filters.splice(i, 1);
    this.storage.writeJson(StorageKeys.DiscoverMovieFilters, this.filters);
  }

  formatDate(d: Date): String {
    let format = (v) => v < 10 ? "0" + v : v;
    return d.getFullYear() + "-" + format(d.getMonth() + 1) + "-" + format(d.getDate());
  }

  removeCatHandler(filter: MediaList) {
    this.removeCat(this.filters.indexOf(filter));
  }

}
