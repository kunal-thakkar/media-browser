import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';
import { DiscoverOption } from '../discover.option';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

export interface Filters {
  index?: number;
  title: string;
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
  customFilterMediaIds: number[] = [];

  constructor(private tmdbService: TmdbService, private storage: StorageService,
    private analytics: AngularFireAnalytics, public dialog: MatDialog){}

  ngOnInit(){
    this.analytics.logEvent('Dashboard loaded');
    this.imgBaseUrl = this.tmdbService.getImgBaseUrl(1);
    this.searchResults = this.storage.readJSON(StorageKeys.SearchHistory) || [];
    this.storage.filtersSubject.subscribe((movieFilters: Filters[]) => {
      this.categories = [];
      this.customFilterMediaIds = [];
      (movieFilters || [])
        .filter(filter => filter.isCustom)
        .forEach(filter => this.customFilterMediaIds.push(...filter.items.map(item => item.id)));
      (movieFilters || []).forEach(filter => {
        let _filter: Filters = Object.assign({}, filter, {isLoading: true});
        this.categories.push(_filter);
        if(_filter.discoverOption)
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

  loadItems(cat: Category, e: Filters){
    if(!e.discoverOption || e.index === (e.discoverOption.page || 1)) return;
    this.tmdbService.discover(cat, e.discoverOption).subscribe(data => {
      e.items.push(...data.results.filter(item => !this.customFilterMediaIds.includes(item.id)));
      e.index = e.discoverOption.page;
      e.totalPages = data.total_pages;
      setTimeout(()=>{ e.isLoading = false }, 2000);
    });
  }

  formatDate(d: Date):String{
    let format = (v)=>v < 10 ? "0"+v : v;
    return d.getFullYear() + "-" + format(d.getMonth()+1) + "-" + format(d.getDate());
  }

  loadMore(i:number){
    if(!this.categories[i].isLoading){
      this.categories[i].discoverOption.page++;
      this.loadItems(Category.Movie, this.categories[i]);
    }
  }

  openDialog($event, i, ii): void {
    const dialogRef = this.dialog.open(AddToCategoryDialog, {
      width: '250px',
      data: {
        category: '',
        options: this.categories.filter((f: Filters) => f.isCustom).map((f:Filters) => f.title)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      let filter: Filters[] = this.categories.filter((f:Filters)=> f.title === result);
      let item: any = this.categories[i].items.splice(ii, 1)[0];
      if(filter.length > 0) {
        filter[0].items.push(item);
      }
      else {
        this.categories.push({
          title: result,
          isCustom: true,
          items: [item]
        });
      }
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
