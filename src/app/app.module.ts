import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { EditorComponent } from './components/editor/editor.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorService } from './shared/services/editor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AppComponent, EditorComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [AuthService, EditorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
