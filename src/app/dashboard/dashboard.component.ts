import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { DiscoverOption } from '../discover.option';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Filters {
  title: string;
  index?: number;
  totalPages?: number;
  isLoading?: boolean;
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

  private day = 1000*60*60*24;
  private week = this.day * 7;
  private year = this.week * 52;
  private today = new Date();

  searchText: string;
  imgBaseUrl = "";
  categories: Filters[] = [];
  searchResults: any = [];
  watchedIds: number[] = this.storage.getWatchedIds(Category.Movie);

  constructor(private tmdbService: TmdbService, private storage: StorageService,
    private analytics: AngularFireAnalytics, public dialog: MatDialog){}

  ngOnInit(){
    this.analytics.logEvent('Dashboard loaded');
    this.imgBaseUrl = this.tmdbService.getImgBaseUrl(1);
    this.searchResults = this.storage.readJSON(StorageKeys.SearchHistory) || [];
    this.storage.filtersSubject.subscribe((movieFilters: Filters[]) => {
      this.categories = [];
      movieFilters.forEach(filter => {
        let _filter: Filters = Object.assign({}, filter, {index: 1, isLoading: true, items: []});
        this.categories.push(_filter);
        this.loadItems(Category.Movie, _filter);
      });
    });
  }

  search(){
    this.tmdbService.search(Category.Movie, this.searchText).subscribe(d=>{
      this.searchResults.unshift({
        items: d.results,
        title: `Search: ${this.searchText}`
      });
      this.storage.writeJson(StorageKeys.SearchHistory, this.searchResults);
    });
  }

  removeSearch(i: number){
    this.searchResults.splice(i, 1);
    this.storage.writeJson(StorageKeys.SearchHistory, this.searchResults);
  }

  removeCat(i: number){
    this.categories.splice(i, 1);
    this.storage.writeJson(StorageKeys.DiscoverMovieFilters, this.categories);
  }

  loadItems(cat: Category, e: Filters, page:number = 1){
    if(!e.discoverOption) return;
    let _f = e.discoverOption;
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

  openDialog($event, i, id): void {
    const dialogRef = this.dialog.open(AddToCategoryDialog, {
      width: '250px',
      data: {
        category: '',
        options: this.categories.filter((f: Filters) => f.isCustom).map((f:Filters) => f.title)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let filter: Filters[] = this.categories.filter((f:Filters)=> f.title === result);
      let item: any = this.categories[id].items.splice(id, 1);
      if(filter.length == 0) {
        this.categories.push({
          title: result,
          isCustom: true,
          items: [item]
        })
      }
      else {
        filter[0].items.push(item)
      }
      this.storage.filtersSubject.next(this.categories);
      this.storage.writeJson(StorageKeys.DiscoverMovieFilters, this.categories);
    });
  }

}

export interface DialogData {
  category: string;
  options: string[];
}

@Component({
  selector: 'category-dialog',
  templateUrl: 'category-dialog.html',
})
export class AddToCategoryDialog implements OnInit {

  categoryInput: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<AddToCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.filteredOptions = this.categoryInput.valueChanges.pipe(
      map(value => this.data.category = value),
      startWith(''),
      map(value => this._filter(value))
    )
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.data.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
