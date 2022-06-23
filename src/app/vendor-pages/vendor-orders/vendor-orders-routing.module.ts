import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorOrdersComponent } from './vendor-orders.component';


const routes: Routes = [
  {
    path: '',
    component: VendorOrdersComponent,
    // canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorOrdersRoutingModule {}