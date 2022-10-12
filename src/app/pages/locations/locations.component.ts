
import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { locationservice } from './locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {



  confirmModal?: NzModalRef; 
  public HeaderButtons: any[] = [
    // {
    //   label: 'Upload',
    // },
    {
      label: 'Add',
    },
  ];
  public tableHeaders: any[] = [
    {
      label: 'Location name',
      key: 'locationName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'pincode',
      key: 'pincode',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Action',
      key: 'actions',
      checked: true,
      sortable: false,
      static: true,
      controls: [{ label: 'Edit' }, { label: 'Delete' }],
    },
  ];
  public tableData = undefined;
  public dataTablePage = 1;
  dataTable = false;
  isUpdate = false;
  constructor(
  private drawerService: NzDrawerService, 
  private LocationService : locationservice,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getLocationTableData();
  }


  openNeworEditLocationDrawer(data = {}, title = "Add Location",  button = 'Add Location', isNew = true){
    console.log(title,button,isNew)
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string, isNew : boolean }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'location',
          button : button,
          isNew : isNew
      }
    });


    editdrawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    editdrawerRef.afterClose.subscribe((data :any) => {
      console.log(data);
      if (typeof data === 'object') {
        // this.responseData = data;
        console.log(data);

        if(this.isUpdate){
          // this.commonService.showProcessingToastOn();
          this.LocationService.updatelocation(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Location updated successfully");
            setTimeout(() => {
              this.getLocationTableData()
            }, 1000);
            ;
            },
            (error)=>{
              console.log(error)
              this.commonService.showProcessingToastOff();
              this.commonService.errorToast(error.message)
            })
        }
        else{
          // this.commonService.showProcessingToastOn();
          
          this.LocationService.addNewlocation(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Location added successfully");
            setTimeout(() => {
              this.getLocationTableData();
            }, 1000);
            
            },
            (error)=>{
              console.log(error)
              // this.commonService.showProcessingToastOff();
              this.commonService.errorToast(error.message)
            })
          }
     }
    });
  }

  openViewLocationDrawer(LocationObj){
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'Location view',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: LocationObj,
        title : 'Location',
        category : 'Location-view'
      }
    });


    viewdrawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    viewdrawerRef.afterClose.subscribe(data => {
      console.log(data);
      if (typeof data === 'string') {
        // this.responseData = data;
      }
    });
  }


  async dataTableActions(Location) {
    console.log(Location.label);
    console.log(Location);

    if(Location.label === 'View'){ 

      this.openViewLocationDrawer(Location.data)

    }else if (Location.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditLocationDrawer(Location.data, 'Update Location', 'Update Location', false);

    }else if (Location.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+Location.data.pincode,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteLocation(Location.data._id);
          
        }
          
      });
    }
  }


 async deleteLocation(id){
  this.commonService.showProcessingToastOn();
    (await this.LocationService.deletelocation(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("Location deleted successfully");
      setTimeout(() => {
        this.getLocationTableData()
      }, 1000);
      },
      (error)=>{
        console.log(error)
        this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message)
      });
  }

  
  dataTableHeaderActions(Location) {
    console.log(Location);
    if(Location.label === 'Add'){
      this.isUpdate = false;
    this.openNeworEditLocationDrawer();
    }
  }



 async getLocationTableData(){
    this.commonService.showProcessingToastOn();
    (await this.LocationService.getlocationsList()).subscribe(async (response: any) =>{
    console.log(response)
    this.tableData = response.data;

    this.commonService.showProcessingToastOff();
        this.refreshDatatable();
   

    
    },
    (error)=>{
      console.log(error)
      // this.commonService.showProcessingToastOff();
      this.commonService.errorToast(error.message)
    })

}

refreshDatatable(){
  this.dataTable = false;
  setTimeout(() => {
   this.dataTable = true;
  }, 100);
 }
}
