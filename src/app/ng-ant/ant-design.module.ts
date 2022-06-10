import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzSpaceModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US } ],
  exports :[
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzSpaceModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule
  
  ]
})
export class AntDesignModule { }
