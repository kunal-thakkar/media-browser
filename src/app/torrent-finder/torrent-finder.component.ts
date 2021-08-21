import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { TorrentResult } from '../shared/model';

@Component({
  selector: 'app-torrent-finder',
  templateUrl: './torrent-finder.component.html',
  styleUrls: ['./torrent-finder.component.css']
})
export class TorrentFinderComponent implements OnInit {

  searchText: string;
  searchResult: Observable<TorrentResult[]>;
  private trackers: string = "";

  constructor(private http: HttpClient, private fireservice: FirebaseService) { }

  ngOnInit(): void {
    this.http.get('https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all.txt', {
      responseType: 'text'
    }).subscribe((res: string) => {
      let list = res.split("\n").filter(e => e.length > 0).map(e => encodeURIComponent(e));
      this.trackers = list.join("&tr=");
    });
  }

  search() {
    this.searchResult = this.fireservice.searchTorrent(this.searchText);
  }

  copyMagnet(title: string, hashCode: string) {
    var input = document.createElement('textarea');
    input.innerHTML = `magnet:?xt=urn:btih:${hashCode}&dn=${encodeURIComponent(title)}&tr=${this.trackers}`;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }
}
