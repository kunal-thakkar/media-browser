import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { IsInitComplete } from './IsInitComplete';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { CastInfoComponent } from './cast-info/cast-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'movie/:id', component: MovieInfoComponent, resolve: [IsInitComplete] },
  { path: 'cast/:id', component: CastInfoComponent, resolve: [IsInitComplete] },
  { path: '**', component: DashboardComponent, resolve: [IsInitComplete] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
