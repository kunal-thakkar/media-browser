import { Component, OnInit } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { DiscoverOption } from '../discover.option';
import { AngularFireAnalytics } from '@angular/fire/analytics';

export interface Filters {
  index?: number;
  title: string;
  totalPages?: number;
  items?: any[];
  discoverOption?: DiscoverOption;
  isCustom?: boolean;
  showOnDashboard?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private day = 1000 * 60 * 60 * 24;
  private week = this.day * 7;
  private year = this.week * 52;
  private today = new Date();

  searchText: string;
  categories: Filters[] = [];
  searchResults: any[] = [];

  constructor(private tmdbService: TmdbService, private storage: StorageService,
    private analytics: AngularFireAnalytics) { }

  ngOnInit() {
    this.analytics.logEvent('Dashboard loaded');
    this.searchResults = this.storage.readJSON(StorageKeys.SearchHistory) || [];
    this.storage.filtersSubject.subscribe((movieFilters: Filters[]) => {
      this.categories = movieFilters;
    });
  }

  search() {
    this.tmdbService.search(Category.Movie, this.searchText).subscribe(d => {
      this.searchResults.unshift({
        items: d.results,
        title: `Search: ${this.searchText}`
      });
      this.storage.writeJson(StorageKeys.SearchHistory, this.searchResults);
    });
  }

  removeSearch(i: number) {
    this.searchResults.splice(i, 1);
    this.storage.writeJson(StorageKeys.SearchHistory, this.searchResults);
  }

  removeCat(i: number) {
    this.categories.splice(i, 1);
    this.storage.writeJson(StorageKeys.DiscoverMovieFilters, this.categories);
  }

  formatDate(d: Date): String {
    let format = (v) => v < 10 ? "0" + v : v;
    return d.getFullYear() + "-" + format(d.getMonth() + 1) + "-" + format(d.getDate());
  }

  removeCatHandler(filter: Filters) {
    this.removeCat(this.categories.indexOf(filter));
  }

  removeSearchHandler(filter: Filters) {
    this.removeSearch(this.searchResults.indexOf(filter));
  }

}