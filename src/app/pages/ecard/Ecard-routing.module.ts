import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcardComponent } from './ecard.component';

const routes: Routes = [
  {
    path: '',
    component: EcardComponent,
    // canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcardRoutingModule {}