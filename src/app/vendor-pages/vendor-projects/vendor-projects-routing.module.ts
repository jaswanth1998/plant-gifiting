import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorProjectsComponent } from './vendor-projects.component';


const routes: Routes = [
  {
    path: '',
    component: VendorProjectsComponent,
    // canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorProjectsRoutingModule {}