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
import { CacheInterceptor } from './shared/cache.interceptor';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { TmdbConfigProvider } from './tmdb.config.provider';
import { ImgFallBackDirective } from './common/ImgFallbackDirective';
import { CastInfoComponent } from './cast-info/cast-info.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FirebaseService } from './firebase.service';


export function TmdbConfigProviderFactory(provider: TmdbConfigProvider) {
  return () => provider.load();
}

export function FirebaseAuthProviderFactory(service: FirebaseService ) {
  return () => service._auth();
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
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    FlexLayoutModule
  ],
  providers: [StorageService, TmdbService, TmdbConfigProvider, FirebaseService, ScreenTrackingService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: TmdbConfigProviderFactory, deps: [TmdbConfigProvider], multi: true },
    { provide: APP_INITIALIZER, useFactory: FirebaseAuthProviderFactory, deps: [FirebaseService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
