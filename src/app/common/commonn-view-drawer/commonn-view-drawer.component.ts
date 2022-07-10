import { Component, Input, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TreeService } from 'src/app/pages/tree/tree.service';

@Component({
  selector: 'app-commonn-view-drawer',
  templateUrl: './commonn-view-drawer.component.html',
  styleUrls: ['./commonn-view-drawer.component.scss']
})
export class CommonnViewDrawerComponent implements OnInit {

 
  @Input() value : any;
  @Input() title = '';
  @Input() category = '';
  TreesList: any;
  LocationsList: any;
  loadview = false;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private TreeService : TreeService
    ) {

    
    }

  async ngOnInit() {
   if(this.category === 'ecard-view'){
    this.value.openFordataList =  this.value.openFordata.split(',');
    console.log(this.value.openFordataList )

   }


   if(this.category === 'ngo-view'){

   (await this.TreeService.getTreeList()).subscribe((response: any) =>{
    console.log(response);
    this.TreesList = response.data.filter((item)=>{
      if( item.isLive.toLowerCase() === 'yes' ||  item.isLive.toLowerCase() === 'true' ){
        return item;
      } 
    })
    console.log(this.TreesList);

    },
    (error)=>{
      console.log(error)
      // this.commonService.showProcessingToastOff();
    });

    

    (await this.TreeService.getlocatjionsList()).subscribe((response: any) =>{
      console.log(response);
      this.LocationsList = response.data;
      console.log(this.LocationsList);
  
      },
      (error)=>{
        console.log(error)
        // this.commonService.showProcessingToastOff();
      });
      this.loadview =  true;
    } 
  }

  close(): void {
    this.drawerRef.close(this.value);
  }

  getLocationname(id){

    const index = this.LocationsList.findIndex(loc => loc._id === id);
    console.log(index)
    if(index >= 0){
     
      return  this.LocationsList[index]['locationName'];
      
      }
      else {
        return "Location error"
      }
  }

  getTreename(id){

    const index = this.TreesList.findIndex(loc => loc._id === id);
    console.log(index)
    if(index >= 0){
     
      return  this.TreesList[index]['treeName'];
      
      }
      else {
        return "Tree error"
      }
  }

}
