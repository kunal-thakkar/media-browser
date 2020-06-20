import { Component, OnInit } from '@angular/core';
import { TmdbService, Category } from './../tmdb.service';
import { StorageService, StorageKeys } from '../storage.service';

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
  categories = [];

  constructor(private tmdbService: TmdbService, private storage: StorageService){}

  ngOnInit(){
    this.tmdbService.configuration().subscribe(data=>{
      this.imgBaseUrl = data.images.secure_base_url + data.images.poster_sizes[1];
      this.storage.readJSON(StorageKeys.DiscoverMovieFilters).forEach((e, i) => {
        this.categories.push({"title": e["_title"], "items": []});
        this.tmdbService.discover(Category.Movie, e)
          .subscribe(data => this.categories[i]["items"] = data.results);  
      });
    });
  }

  formatDate(d: Date):String{
    let format = (v)=>v < 10 ? "0"+v : v;
    return d.getFullYear() + "-" + format(d.getMonth()+1) + "-" + format(d.getDate());
  }

}
