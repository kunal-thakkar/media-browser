import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CategoryDialogComponent } from 'src/app/category-dialog/category-dialog.component';
import { DiscoverOption } from 'src/app/discover.option';
import { StorageService } from 'src/app/storage.service';
import { Category, TmdbService } from 'src/app/tmdb.service';
import { DiscoverResponse, ScrollableItem } from '../model';

export interface ScrollItem {
  id: number;
  poster_path: string;
}

@Component({
  selector: 'app-scrollview',
  templateUrl: './scrollview.component.html',
  styleUrls: ['./scrollview.component.css']
})
export class ScrollviewComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() opt: DiscoverOption;
  @Input() items: ScrollableItem[] = [];
  @Input() cat: Category;
  @Output() removeEvent = new EventEmitter<DiscoverOption>();
  @ViewChild('loadMore', { static: false }) loadMore: ElementRef;

  isLoading: boolean = false;
  imgBaseUrl: string;
  index: number = 1;
  totalPages: number = 1;
  obsever: IntersectionObserver = new IntersectionObserver((entries, observer) => {
    if (entries.length > 0 && entries[0].isIntersecting) {
      this.loadMoreItems();
    }
  });

  constructor(private tmdbService: TmdbService, private storage: StorageService, private dialog: MatDialog) {
    this.imgBaseUrl = tmdbService.getImgBaseUrl();
  }

  ngOnInit(): void {
    if (this.opt) {
      this.opt.page = this.opt.page || 1;
      this.loadItems();
    }
  }

  ngAfterViewInit() {
    this.obsever.observe(this.loadMore.nativeElement);
  }

  loadItems() {
    this.isLoading = true;
    this.tmdbService.discover(this.cat, this.opt).pipe(take(1)).subscribe((data: DiscoverResponse) => {
      this.items.push(...data.results);
      this.index = this.opt.page;
      this.totalPages = data.total_pages;
      this.isLoading = false;
    });
  }

  loadMoreItems() {
    if (this.isLoading || this.index >= (this.totalPages - 1)) return;
    this.opt.page++;
    this.loadItems();
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
    if (this.removeEvent) this.removeEvent.emit(this.opt);
  }
}
