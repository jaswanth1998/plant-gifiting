import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule  } from '@angular/router';
import { BaseComponent } from './base.component';



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
      },
      {
        path: 'tree',
        loadChildren: () =>
        import('../pages/tree/tree.module').then((m)=>{
          return m.TreeModule
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

