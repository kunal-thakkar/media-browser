import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../tmdb.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StorageKeys, StorageService } from '../storage.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MediaList } from '../shared/model';

@Component({
  selector: 'app-cast-info',
  templateUrl: './cast-info.component.html',
  styleUrls: ['./cast-info.component.css']
})
export class CastInfoComponent implements OnInit {

  castInfo: any;
  imgBaseUrl: string;
  smallImgBaseUrl: string;

  constructor(private service: TmdbService, private route: ActivatedRoute,
    private storage: StorageService, public dialog: MatDialog) { }

  ngOnInit() {
    this.imgBaseUrl = this.service.getImgBaseUrl(3);
    this.smallImgBaseUrl = this.service.getImgBaseUrl(1);
    this.route.params.subscribe(p => {
      this.service.getCastInfo(p.id).subscribe(d => this.castInfo = d);
    });
  }

  openDialog(item) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: {
        category: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let filter: MediaList[] = this.storage.movieFilters.filter((f: MediaList) => f.title === result);
      if (filter.length > 0) {
        if (filter[0].items.filter(i => i.id === item.id).length === 0) {
          filter[0].items.push(item);
        }
      }
      else {
        this.storage.movieFilters.push({
          title: result,
          isCustom: true,
          items: [item]
        });
      }
      this.storage.writeJson(StorageKeys.DiscoverMovieFilters, this.storage.movieFilters);
    });
  }
}
