import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgolistComponent } from './ngolist.component';

const routes: Routes = [
  {
    path: '',
    component: NgolistComponent,
    // canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgolistRoutingModule {}