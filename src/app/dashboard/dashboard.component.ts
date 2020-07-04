import { Component, OnInit, HostListener } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { DiscoverOption } from '../discover.option';

export interface Filters {
  title: string;
  index: number;
  totalPages?: number;
  isLoading: boolean;
  items: any[];
  filter?: DiscoverOption;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private day = 1000*60*60*24;
  private week = this.day * 7;
  private year = this.week * 52;
  private today = new Date();

  searchText: string;
  imgBaseUrl = "";
  categories: Filters[] = [];
  watchedIds: number[] = this.storage.getWatchedIds(Category.Movie);

  constructor(private tmdbService: TmdbService, private storage: StorageService){}

  ngOnInit(){
    this.imgBaseUrl = this.tmdbService.getImgBaseUrl(1);
    this.storage.readJSON(StorageKeys.DiscoverMovieFilters).forEach((e: DiscoverOption, i) => {
      let _filter = {index: 1, title: e["_title"], isLoading: true, filter: e, items: []};
      this.categories.push(_filter);
      this.loadItems(Category.Movie, _filter);
    });
  }

  search(){
    this.tmdbService.search(Category.Movie, this.searchText).subscribe(d=>{
      this.categories.unshift({
        index:0,
        totalPages: d.total_pages,
        isLoading: false,
        items: d.results,
        title: `Search: ${this.searchText}`
      });
    });
  }

  loadItems(cat: Category, e: Filters, page:number = 1){
    if(!e.filter) return;
    let _f = e.filter;
    _f.page = page;
    this.tmdbService.discover(cat, _f).subscribe(data => {
      e.items.push(...data.results);
      e.index = page;
      e.totalPages = data.total_pages;
      setTimeout(()=>{ e.isLoading = false }, 2000);
    });
  }

  isWatched(id: number): boolean {
    return this.watchedIds.includes(id);
  }

  watched(catIdx: number, itemId: number){
    this.watchedIds.push(itemId);
    this.storage.addWatchedId(Category.Movie, itemId);
  }

  formatDate(d: Date):String{
    let format = (v)=>v < 10 ? "0"+v : v;
    return d.getFullYear() + "-" + format(d.getMonth()+1) + "-" + format(d.getDate());
  }

  loadMore(i:number){
    if(!this.categories[i].isLoading){
      this.loadItems(Category.Movie, this.categories[i], ++this.categories[i].index);
    }
  }
}
