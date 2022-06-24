import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { OrdersService } from './orders-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  confirmModal?: NzModalRef; 
  public HeaderButtons: any[] = [
    // {
    //   label: 'Upload',
    // },
    // {
    //   label: 'Add',
    // },
  ];
  public tableHeaders: any[] = [
    {
      label: 'Vendor',
      key: 'vendorName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Tree',
      key: 'treeNameOrdered',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Status',
      key: 'status',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Count',
      key: 'numberOfSpeciesOrdered',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Project',
      key: 'projectName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Location',
      key: 'location',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    
    {
      label: 'Sender',
      key: 'senderName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Sender PH',
      key: 'senderPhoneNumber',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Receiver',
      key: 'receiverName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    
    {
      label: 'Receiver PH',
      key: 'receiverPhoneNumber',
      checked: true,
      sortable: true,
      sortDir: 'desc',
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
  private OrdersService : OrdersService,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getOrdersTableData();
  }


  openNeworEditOrdersDrawer(data = {}, title = "Add Orders",  button = 'Add Orders', isNew = true){
    console.log(title,button,isNew)
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string, isNew : boolean }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '1000px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'orders',
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
          this.OrdersService.updateOrders(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Orders updated successfully");
            setTimeout(() => {
              this.getOrdersTableData()
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
          this.OrdersService.addNewOrders(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Orders added successfully");
            setTimeout(() => {
              this.getOrdersTableData();
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

  openViewOrdersDrawer(OrdersObj){
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'Orders view',
      // nzFooter: 'Footer',
      nzWidth : '1000px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: OrdersObj,
        title : 'Orders',
        category : 'orders-view'
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


  async dataTableActions(Orders) {
    console.log(Orders.label);
    console.log(Orders);

    if(Orders.label === 'View'){ 

      this.openViewOrdersDrawer(Orders.data)

    }else if (Orders.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditOrdersDrawer(Orders.data, 'Update Orders', 'Update Orders', false);

    }else if (Orders.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+Orders.data.OrdersName,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteOrders(Orders.data._id);
          
        }
          
      });
    }
  }


 async deleteOrders(id){
  this.commonService.showProcessingToastOn();
    (await this.OrdersService.deleteOrders(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("Orders deleted successfully");
      setTimeout(() => {
        this.getOrdersTableData()
      }, 1000);
      },
      (error)=>{
        console.log(error)
        this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message)
      });
  }

  
  dataTableHeaderActions(Orders) {
    console.log(Orders);
    if(Orders.label === 'Add'){
      this.isUpdate = false;
    this.openNeworEditOrdersDrawer();
    }
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


 async getOrdersTableData(){
    this.commonService.showProcessingToastOn();
    (await this.OrdersService.getOrdersList()).subscribe((response: any) =>{
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

