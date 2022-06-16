import { Component, Input, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-commonn-view-drawer',
  templateUrl: './commonn-view-drawer.component.html',
  styleUrls: ['./commonn-view-drawer.component.scss']
})
export class CommonnViewDrawerComponent implements OnInit {

 
  @Input() value : any;
  @Input() title = '';
  @Input() category = '';

  constructor(
    private drawerRef: NzDrawerRef<string>,
    ) {

    
    }

  ngOnInit(): void {
   if(this.category === 'ecard-view'){
    this.value.openFordataList =  this.value.openFordata.split(',');
    console.log(this.value.openFordataList )
   }
  }

  close(): void {
    this.drawerRef.close(this.value);
  }


}
