import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from 'src/app/category-dialog/category-dialog.component';
import { Filters } from 'src/app/dashboard/dashboard.component';
import { StorageService } from 'src/app/storage.service';
import { Category, TmdbService } from 'src/app/tmdb.service';

export interface ScrollItem {
  id: number;
  poster_path: string;
}

@Component({
  selector: 'app-scrollview',
  templateUrl: './scrollview.component.html',
  styleUrls: ['./scrollview.component.css']
})
export class ScrollviewComponent implements OnInit {
  @Input() filter: Filters;
  @Output() removeEvent = new EventEmitter<Filters>();

  isLoading: boolean;
  imgBaseUrl: string;

  constructor(private tmdbService: TmdbService, private storage: StorageService, private dialog: MatDialog) {
    this.imgBaseUrl = tmdbService.getImgBaseUrl();
  }

  ngOnInit(): void {
    if (this.filter.discoverOption) this.tmdbService.loadItems(Category.Movie, this.filter);
  }

  loadMore() {
    if (this.isLoading) return;
    this.filter.discoverOption.page++;
    this.isLoading = true;
    this.tmdbService.loadItems(Category.Movie, this.filter);
    setTimeout(() => { this.isLoading = false }, 500);
  }

  addItemTo(item: any) {
    this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: { category: '' }
    }).afterClosed().subscribe(result => {
      if (!result) return;
      this.storage.moveMovieItem(result, item);
    });
  }

  remove() {
    if (this.removeEvent) this.removeEvent.emit(this.filter);
  }
}
