import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../tmdb.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cast-info',
  templateUrl: './cast-info.component.html',
  styleUrls: ['./cast-info.component.css']
})
export class CastInfoComponent implements OnInit {

  castInfo: any;
  imgBaseUrl: string;
  smallImgBaseUrl: string;

  constructor(private service: TmdbService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.imgBaseUrl = this.service.getImgBaseUrl(3);
    this.smallImgBaseUrl = this.service.getImgBaseUrl(0);
    this.route.params.subscribe(p=>{
      this.service.getCastInfo(p.id).subscribe(d=>this.castInfo = d);
    });
  }

}
