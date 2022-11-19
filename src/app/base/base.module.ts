import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule  } from '@angular/router';
import { BaseComponent } from './base.component';
import { NzSelectModule } from 'ng-zorro-antd/select';



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
      },
      {
        path: 'events',
        loadChildren: () =>
        import('../pages/events/events-routing.module').then((m)=>{
          return m.EventsRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },

      {
        path: 'ecard',
        loadChildren: () =>
        import('../pages/ecard/Ecard-routing.module').then((m)=>{
          return m.EcardRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },

      {
        path: 'queries',
        loadChildren: () =>
        import('../pages/queries/queries-routing.module').then((m)=>{
          return m.QueriesRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },
      {
        path: 'orders',
        loadChildren: () =>
        import('../pages/orders/orders-routing.module').then((m)=>{
          return m.OrdersRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },
      {
        path: 'locations',
        loadChildren: () =>
        import('../pages/locations/Ecard-routing.module').then((m)=>{
          return m.LocationsRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },
      
      {
        path: 'vendor-projects',
        loadChildren: () =>
        import('../vendor-pages/vendor-projects/vendor-projects-routing.module').then((m)=>{
          return m.VendorProjectsRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },
      {
        path: 'vendor-orders',
        loadChildren: () =>
        import('../pages/orders/orders-routing.module').then((m)=>{
          return m.OrdersRoutingModule
           }),
        // canActivate: [RouterGuardService]
      },
      {
        path: 'vendor-reports',
        loadChildren: () =>
        import('../vendor-pages/vendor-reports/vendor-reports-routing.module').then((m)=>{
          return m.VendorReportsRoutingModule
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
    NzSelectModule
    
  ]
})
export class BaseModule { }

