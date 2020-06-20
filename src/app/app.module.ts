import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TmdbService } from './tmdb.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StorageService } from './storage.service';
import { SettingsComponent } from './settings/settings.component';
import { IsInitComplete } from './IsInitComplete';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [IsInitComplete, StorageService, TmdbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
