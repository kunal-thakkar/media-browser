import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  isLoading: boolean = false;
  private trackers: string = "";

  constructor(private http: HttpClient, private fireservice: FirebaseService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.http.get('https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all.txt', {
      responseType: 'text'
    }).subscribe((res: string) => {
      let list = res.split("\n").filter(e => e.length > 0).map(e => encodeURIComponent(e));
      this.trackers = list.join("&tr=");
    });
  }

  search() {
    this.isLoading = true;
    this.searchResult = this.fireservice.searchTorrent(this.searchText).pipe(catchError(err => {
      this.snackBar.open(`Error: ${err.error.message}`, 'Ok');
      this.isLoading = false;
      return [];
    }));
  }

  copyMagnet(title: string, hashCode: string) {
    var input = document.createElement('textarea');
    input.innerHTML = `magnet:?xt=urn:btih:${hashCode}&dn=${encodeURIComponent(title)}&tr=${this.trackers}`;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    this.snackBar.open(`${title} copied!`, null, { duration: 2000 });
    return result;
  }
}
