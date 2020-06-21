import { Component, OnInit, HostListener } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { DiscoverOption } from '../discover.option';

export interface Filters {
  title: string;
  index: number;
  isLoading: boolean;
  items: any[];
  filter: DiscoverOption;
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

  imgBaseUrl = "";
  categories: Filters[] = [];
  watchedIds: number[] = this.storage.getWatchedIds(Category.Movie);

  constructor(private tmdbService: TmdbService, private storage: StorageService){}

  ngOnInit(){
    this.tmdbService.configuration().subscribe(data=>{
      this.imgBaseUrl = data.images.secure_base_url + data.images.poster_sizes[1];
      this.storage.readJSON(StorageKeys.DiscoverMovieFilters).forEach((e: DiscoverOption, i) => {
        let _filter = {index: 1, title: e["_title"], isLoading: true, filter: e, items: []};
        this.categories.push(_filter);
        this.loadItems(Category.Movie, _filter);
      });
    });
  }

  loadItems(cat: Category, e: Filters, page:number = 1){
    let _f = e.filter;
    _f.page = page;
    this.tmdbService.discover(cat, _f).subscribe(data => {
      e.items.push(...data.results);
      e.index = page;
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
