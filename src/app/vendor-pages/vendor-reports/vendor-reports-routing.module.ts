import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorReportsComponent } from './vendor-reports.component';


const routes: Routes = [
  {
    path: '',
    component: VendorReportsComponent,
    // canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorReportsRoutingModule {}