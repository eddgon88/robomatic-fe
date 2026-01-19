import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatTableModule } from '@angular/material/table';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './components/components.module';
import { TestModule } from './test/test.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CodeEditorModule } from '@ngstack/code-editor';
import { HomeComponent } from './pages/home/home.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ComponentsModule,
    TestModule,
    SchedulerModule,
    MatTableModule,
    NgbModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    CodeEditorModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: JWT_OPTIONS, 
      useValue: JWT_OPTIONS },
        JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
