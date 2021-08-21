import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, CanLoad, Route, UrlSegment, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { CastInfoComponent } from './cast-info/cast-info.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { MediaCollectionComponent } from './media-collection/media-collection.component';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { TorrentFinderComponent } from './torrent-finder/torrent-finder.component';

@Injectable()
export class AuthGaurdService implements CanActivate {

  constructor(private router: Router, private storage: StorageService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (route.url[0].path === "collection" && !this.storage.user) {
      this.router.navigate(["/"]);
      return false;
    }
    if (route.url[0].path === 'tf' && !this.storage.user) {
      this.router.navigate(["/"]);
      return false;
    }
    return true;
  }

}

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'collection', component: MediaCollectionComponent, canActivate: [AuthGaurdService] },
  { path: 'tf', component: TorrentFinderComponent, canActivate: [AuthGaurdService] },
  { path: 'settings', component: SettingsComponent },
  { path: 'movie/:id', component: MovieInfoComponent },
  { path: 'cast/:id', component: CastInfoComponent },
  { path: '**', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
