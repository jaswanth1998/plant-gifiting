import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { NgoServicesService } from './ngo-services.service';


@Component({
  selector: 'app-ngolist',
  templateUrl: './ngolist.component.html',
  styleUrls: ['./ngolist.component.scss']
})
export class NgolistComponent implements OnInit {

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
      label: 'NGO name',
      key: 'ngoName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'phone Number',
      key: 'phoneNumber',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'spocName',
      key: 'spocName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Description',
      key: 'description',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Address',
      key: 'address',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Email',
      key: 'email',
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
      controls: [{ label: 'View' },{ label: 'Edit' }, { label: 'Delete' }],
    },
  ];
  public tableData = undefined;
  public dataTablePage = 1;
  dataTable = false;
  isUpdate = false;
  constructor(
  private drawerService: NzDrawerService, 
  private NGOService : NgoServicesService,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getNGOTableData();
  }


  openNeworEditNGODrawer(data = {}, title = "Add NGO",  button = 'Add NGO'){
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'NGO',
          button : button
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
          this.NGOService.updateNGO(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("NGO updated successfully");
            setTimeout(() => {
              this.getNGOTableData()
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
          this.NGOService.addNewNGO(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("NGO added successfully");
            setTimeout(() => {
              this.getNGOTableData();
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

  openViewNGODrawer(NGOObj){
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'NGO view',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: NGOObj,
        title : 'NGO',
        category : 'ngo-view'
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


  async dataTableActions(event) {
    console.log(event.label);
    console.log(event);

    if(event.label === 'View'){ 

      this.openViewNGODrawer(event.data)

    }else if (event.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditNGODrawer(event.data, 'Update NGO', 'Update NGO');

    }else if (event.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+event.data.ngoName,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteNGO(event.data._id);
          
        }
          
      });
    }
  }


 async deleteNGO(id){
  this.commonService.showProcessingToastOn();
    (await this.NGOService.deleteNGO(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("NGO deleted successfully");
      setTimeout(() => {
        this.getNGOTableData()
      }, 1000);
      },
      (error)=>{
        console.log(error)
        this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message)
      });
  }

  
  dataTableHeaderActions(event) {
    console.log(event);
    if(event.label === 'Add'){
    this.openNeworEditNGODrawer();
    }
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


 async getNGOTableData(){
    this.commonService.showProcessingToastOn();
    (await this.NGOService.getNGOList()).subscribe((response: any) =>{
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

function subscribe(arg0: (response: any) => void) {
  throw new Error('Function not implemented.');
}

