import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TmdbService } from './tmdb.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StorageService } from './storage.service';
import { SettingsComponent } from './settings/settings.component';
import { IsInitComplete } from './IsInitComplete';
import { CacheInterceptor } from './shared/cache.interceptor';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { TmdbConfigProvider } from './tmdb.config.provider';
import { ImgFallBackDirective } from './common/ImgFallbackDirective';
import { CastInfoComponent } from './cast-info/cast-info.component';


export function TmdbConfigProviderFactory(provider: TmdbConfigProvider) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SettingsComponent,
    MovieInfoComponent,
    ImgFallBackDirective,
    CastInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [IsInitComplete, StorageService, TmdbService, TmdbConfigProvider,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: TmdbConfigProviderFactory, deps: [TmdbConfigProvider], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
