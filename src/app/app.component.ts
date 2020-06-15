import { Component } from '@angular/core';
import { TmdbService } from './tmdb.service';
import { Option } from './discover.option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private tmdbService: TmdbService){}

  private day = 1000*60*60*24;
  private week = this.day * 7;
  private year = this.week * 52;
  private today = new Date();

  imgBaseUrl = "";
  categories = [
    {
      "label": "Latest movies", "items": [], "option": {
        'lang':'hi',
        'sort_by':'popularity.desc',
        'primary_release_date':'>'+ this.formatDate(new Date(this.today.getTime() - this.week))
      }
    },
    {
      "label": "Popular movies", "items": [], "option": {
        'lang':'hi',
        'sort_by':'popularity.desc'
      }
    },
    {
      "label": "Popular kids movies", "items": [], "option": {
        'lang':'hi',
        'sort_by':'popularity.desc',
        'certification_country':'US',
        'certification':'<G'
      }
    },
    {
      "label": "Popular last 5 year", "items": [], "option": {
        'lang':'hi',
        'primary_release_date':'>'+ this.formatDate(new Date(this.today.getTime()-this.year*5)),
        'sort_by':'popularity.desc'
      }
    }
  ];

  ngOnInit(){
    this.tmdbService.configuration().subscribe(data=>{
      this.imgBaseUrl = data.images.secure_base_url + data.images.poster_sizes[1];
      this.categories.forEach(category=>{
        this.tmdbService.discoverMovie(category.option)
          .subscribe(data => category.items = data.results);
      });
    });
  }

  formatDate(d: Date):String{
    let format = (v)=>v < 10 ? "0"+v : v;
    return d.getFullYear() + "-" + format(d.getMonth()+1) + "-" + format(d.getDate());
  }
}

