import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { CastInfoComponent } from './cast-info/cast-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
