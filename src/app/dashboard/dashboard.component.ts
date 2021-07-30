import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MediaList, Genre } from '../shared/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('loadMore', { static: false }) loadMore: ElementRef;

  searchText: string;
  searchResults: any[] = [];
  filters: MediaList[] = [];
  filterStart: number = 0;
  filterStep = 5;
  isLoading: boolean = false;
  observer: IntersectionObserver;

  constructor(private tmdbService: TmdbService, public storage: StorageService,
    private analytics: AngularFireAnalytics) { }

  ngOnInit() {
    this.analytics.logEvent('Dashboard loaded');
    this.observer = new IntersectionObserver((entries, observer) => {
      if (entries.length > 0 && entries[0].isIntersecting) {
        this.loadFilters();
      }
    });
    this.searchResults = this.storage.readJSON(StorageKeys.SearchHistory) || [];
    this.loadFilters();
  }

  ngAfterViewInit() {
    this.observer.observe(this.loadMore.nativeElement);
  }

  loadFilters() {
    if (this.storage.genres.length <= this.filterStart) return;
    this.storage.genres.slice(this.filterStart, Math.min(this.storage.genres.length, this.filterStart + this.filterStep))
      .forEach((g: Genre) => {
        this.filters.push({
          title: g.name,
          category: Category.Movie,
          discoverOption: {
            with_genres: g.id
          }
        });
      });
    this.filterStart += this.filterStep;
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

  removeSearchHandler(filter: MediaList) {
    this.removeSearch(this.searchResults.indexOf(filter));
  }
}