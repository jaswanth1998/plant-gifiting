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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';


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
    NzBreadCrumbModule,
    NzModalModule,
    NzSliderModule,
    NzLayoutModule,
    NzDividerModule,
    NzDrawerModule,
    NzMessageModule,
    NzSwitchModule
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
    NzBreadCrumbModule,
    NzModalModule,
    NzSliderModule,
    NzLayoutModule,
    NzDividerModule,
    NzDrawerModule,
    NzMessageModule,
    NzSwitchModule
  
  ]
})
export class AntDesignModule { }
