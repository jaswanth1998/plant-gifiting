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
import { TableComponent } from './table/table.component';

import {NgxPaginationModule} from 'ngx-pagination'; 
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonDrawerComponent } from './common/common-drawer/common-drawer.component';
import { TreeComponent } from './pages/tree/tree.component';
import { CommonnViewDrawerComponent } from './common/commonn-view-drawer/commonn-view-drawer.component';
import { EventsComponent } from './pages/events/events.component';
import { EcardComponent } from './pages/ecard/ecard.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BaseComponent,
    WelcomeComponent,
    NgolistComponent,
    DashboardComponent,
    TableComponent,
    CommonDrawerComponent,
    TreeComponent,
    CommonnViewDrawerComponent,
    EventsComponent,
    EcardComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AntDesignModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzButtonModule
    
    
  ],
  exports :[ ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
