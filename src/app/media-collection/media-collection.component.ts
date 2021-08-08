import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Media, MediaList } from '../shared/model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-media-collection',
  templateUrl: './media-collection.component.html',
  styleUrls: ['./media-collection.component.css']
})
export class MediaCollectionComponent implements OnInit {

  collections: MediaList[] = [];
  mediaItems: Media[] = [];

  constructor(private storage: StorageService, private firebase: FirebaseService,
    private analytics: AngularFireAnalytics) { }

  ngOnInit(): void {
    this.analytics.logEvent('My Collection loaded');
    this.storage.getCollection().subscribe(data => {
      this.mediaItems = data;
      this.load();
    });
  }

  load() {
    let result: MediaList[] = [];
    this.storage.genres.forEach(g => {
      result.push({
        title: g.name,
        items: this.mediaItems.filter(item => item.genre_ids.includes(+g.id))
      });
    });
    this.collections = result.filter(list => list.items && list.items.length > 0);
    console.log(this.collections)
  }

}
