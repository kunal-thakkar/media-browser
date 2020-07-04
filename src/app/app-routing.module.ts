import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { IsInitComplete } from './IsInitComplete';
import { MovieInfoComponent } from './movie-info/movie-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'dashboard', component: DashboardComponent, resolve: [IsInitComplete] },
  { path: 'movie/:id', component: MovieInfoComponent, resolve: [IsInitComplete] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
