import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-common-drawer',
  templateUrl: './common-drawer.component.html',
  styleUrls: ['./common-drawer.component.scss']
})
export class CommonDrawerComponent implements OnInit {
  
  @Input() value = '';
  TreeForm : FormGroup;
  @Input() title = 'Add tree'

  constructor(private drawerRef: NzDrawerRef<string>) {}

  ngOnInit(): void {
    this.TreeForm = new FormGroup({
      treename : new FormControl(null, [
        Validators.required,
      ]),
      primarytag : new FormControl(null, [
        Validators.required,
      ]),
      secondarytag : new FormControl(null, [
        Validators.required,
      ]),
      treeimage : new FormControl(null, [
        Validators.required,
      ]),
      treeintro : new FormControl(null, [
        Validators.required,
      ]),
    });
  }

  close(): void {
    this.drawerRef.close(this.value);
  }
  treeSubmit(){
    console.log(this.TreeForm.value)
  }

  onImagesSelected(event:any){
    console.log(event.target.files);
  }

  onOneImageSelected(event:any){
    console.log(event.target.files);
  }

}
