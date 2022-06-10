import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AntDesignModule } from './ng-ant/ant-design.module';
import { LoginComponent } from './login/login.component';
import { BaseComponent } from './base/base.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NgolistComponent } from './pages/ngolist/ngolist.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BreadcrumbComponent } from './common-features/breadcrumb/breadcrumb.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BaseComponent,
    WelcomeComponent,
    NgolistComponent,
    DashboardComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AntDesignModule,
    ReactiveFormsModule,
    
    
  ],
  exports :[ ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
