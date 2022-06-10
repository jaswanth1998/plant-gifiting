import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule  } from '@angular/router';
import { BaseComponent } from './base.component';
import { NgolistComponent } from '../pages/ngolist/ngolist.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { RouterGuardService } from './router-guard.service';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        redirectTo: '/lanch/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => 
        import('../pages/dashboard/dashboard.module').then((m)=>{
        return m.DashboardModule
         }),
        // canActivate: [RouterGuardService]
      },
      {
        path: 'ngolist',
        loadChildren: () =>
        import('../pages/ngolist/ngolist.module').then((m)=>{
          return m.NgolistModule
           }),
        // canActivate: [RouterGuardService]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BaseModule { }

