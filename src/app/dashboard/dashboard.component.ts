import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MediaList, Genre, Language, SelectOption } from '../shared/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('loadMore', { static: false }) loadMore: ElementRef;

  searchText: string;
  searchResults: any[] = [];
  mediaList: MediaList[] = [];
  listStart: number = 0;
  listEnd: number = 0;
  listStep = 5;
  isLoading: boolean = false;
  observer: IntersectionObserver;

  langOpt: SelectOption[];
  sortOpt: SelectOption[] = this.tmdbService.sortOpt;
  groupOpt: SelectOption[];
  groups: MediaList[];

  constructor(private tmdbService: TmdbService, public storage: StorageService,
    private analytics: AngularFireAnalytics) { }

  ngOnInit() {
    this.analytics.logEvent('Dashboard loaded');
    let preFilters = this.storage.readJSON(StorageKeys.DashboardFilters) || { group_by: 'genre', with_original_language: [] }
    this.langOpt = this.storage.readJSON(StorageKeys.Languages).map((l: Language) => ({
      value: l.iso_639_1, text: l.english_name, selected: (preFilters.with_original_language || []).includes(l.iso_639_1)
    }));
    this.sortOpt.forEach(opt => opt.selected = preFilters.sort_by === opt.value);
    this.groupOpt = [
      { value: "genre", text: "Genre", selected: true }
    ];
    this.observer = new IntersectionObserver((entries, observer) => {
      if (entries.length > 0 && entries[0].isIntersecting) {
        this.loadFilters();
      }
    });
    this.searchResults = this.storage.readJSON(StorageKeys.SearchHistory) || [];
    this.applyFilters(preFilters);
  }

  ngAfterViewInit() {
    this.observer.observe(this.loadMore.nativeElement);
  }

  applyFilters(filters: any) {
    this.storage.writeJson(StorageKeys.DashboardFilters, filters);
    this.listStart = 0;
    this.listEnd = 0;
    this.mediaList = [];
    switch (filters.group_by) {
      case 'genre':
        this.groups = this.storage.genres.map(g => ({
          title: g.name,
          category: Category.Movie,
          discoverOption: {
            with_genres: g.id,
            with_original_language: filters.with_original_language ? filters.with_original_language : null,
            sort_by: filters.sort_by ? filters.sort_by : null
          }
        }));
        this.listEnd = this.groups.length;
        this.loadFilters();
        break;
      default: this.listEnd = 0;
    }
  }

  loadFilters() {
    if (this.listEnd <= this.listStart) return;
    this.groups.slice(this.listStart, Math.min(this.listEnd, this.listStart + this.listStep))
      .forEach((ml: MediaList) => this.mediaList.push(ml));
    this.listStart += this.listStep;
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