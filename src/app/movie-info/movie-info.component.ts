import { Component, OnInit } from '@angular/core';
import { TmdbService, Category } from '../tmdb.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit {

  mediaInfo: any = null;
  genres: string;
  imgBaseUrl: string;
  castImgBaseUrl: string;
  spoken_languages: string;
  googleSearchResult: any;

  constructor(private service: TmdbService, private router: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.imgBaseUrl = this.service.getImgBaseUrl(4);
    this.castImgBaseUrl = this.service.getImgBaseUrl(0);
    this.router.params.subscribe(param => {
      if(param.id){
        this.service.getInfo(Category.Movie, param.id).subscribe(d=>{
          this.mediaInfo = d;
          let _genres = [];
          d.genres.forEach(e => _genres.push(e.name));
          this.genres = _genres.join(", ");
          let _spoken_languages = [];
          d.spoken_languages.forEach(l=>_spoken_languages.push(l.name))
          this.spoken_languages = _spoken_languages.join(", ");
          this.firebaseService
            .search(this.mediaInfo.title)
            .pipe(take(1))
            .subscribe(data => this.googleSearchResult = data);
        });
      }
    });
  }

}
