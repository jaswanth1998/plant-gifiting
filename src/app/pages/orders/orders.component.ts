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
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  confirmModal?: NzModalRef;
  public HeaderButtons: any[] = [
    // {
    //   label: 'Export',
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
      filter: true,
    },
    {
      label: 'Tree',
      key: 'treeNameOrdered',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Status',
      key: 'status',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Count',
      key: 'numberOfSpeciesOrdered',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
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
      filter: true,
    },
    {
      label: 'Sender PH',
      key: 'senderPhoneNumber',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Receiver',
      key: 'receiverName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Sender Email',
      key: 'senderEmail',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },

    {
      label: 'Receiver Email',
      key: 'receiverEmailId',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },


    {
      label: 'Receiver PH',
      key: 'receiverPhoneNumber',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Order id',
      key: '_id',
      checked: false,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },{
      // panNumber
      label: 'Pan Number',
      key: 'panNumber',
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
      controls: [{ label: 'View' }, { label: 'Edit' }],
    },
  ];
  public tableData = undefined;
  public dataTablePage = 1;
  dataTable = false;
  isUpdate = false;
  constructor(
    private drawerService: NzDrawerService,
    private OrdersService: OrdersService,
    private modal: NzModalService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getOrdersTableData();
  }

  openNeworEditOrdersDrawer(
    data = {},
    title = 'Add Orders',
    button = 'Add Orders',
    isNew = true
  ) {
    console.log(title, button, isNew);
    const editdrawerRef = this.drawerService.create<
      CommonDrawerComponent,
      { value: Object; button: string; category: string; isNew: boolean },
      Object
    >({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth: '1000px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
        value: data,
        category: 'orders',
        button: button,
        isNew: isNew,
      },
    });

    editdrawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    editdrawerRef.afterClose.subscribe((data: any) => {
      console.log(data);
      if (typeof data === 'object') {
        // this.responseData = data;
        console.log(data);

        if (this.isUpdate) {
          // this.commonService.showProcessingToastOn();
          console.log(data)
          this.OrdersService.updateOrders(data._id, data).subscribe(
            async (response: any) => {
              if (data['status'] === 'Planted') {
                const orderData = await (await this.OrdersService.getOrdersListByID(data._id)).toPromise()
                console.log('orderData', orderData)
                const responseData = orderData['data'][0]


                const sendEmail = `
                Dear ${responseData['senderName']},
                <br><br>
                Greetings from MakeMyTrip Foundation.
                <br><br>
                We have received your generous contribution of ${responseData['amountReceived']} towards maintenance of ${responseData['projectName']} at ${responseData['location']}. Your orde ID is ${data._id}. An E Card with your wishes has been sent to ${responseData['receiverEmailId']}.
                You can choose to view your order on the app by logging with your phone number. 
                <br><br>
                Thanks for your contribution towards making our earth healthier.
                <br><br>
                Team MakeMyTrip Foundation`
                const emailObj = {
                  "to": responseData['senderEmail'],
                  "subject": "Your Order is confirmed | " + data._id,
                  "text": sendEmail,
                  "html": sendEmail

                }
                await (await this.OrdersService.sendEmail(emailObj)).toPromise()
              }
              if (data['status'] === 'Project concluded') {
                const orderData = await (await this.OrdersService.getOrdersListByID(data._id)).toPromise()
                console.log('orderData', orderData)
                const responseData = orderData['data'][0]


                const sendEmail = `                
                Dear ${responseData['senderName']},
                <br><br>
                
                Greetings from MakeMyTrip Foundation.
                <br><br>
                It is with great pleasure that we wish to inform you that ${responseData['projectName']} at ${responseData['location']} has been completed. Your contribution has helped in making this possible and will further help in maintainance of this project.
                <br><br>
                Thanks for your contribution towards making our earth healthier.
                <br><br>
                Team MakeMyTrip Foundation`
                const emailObj = {
                  "to": responseData['senderEmail'],
                  "subject": "Your Order is confirmed | " + data._id,
                  "text": sendEmail,
                  "html": sendEmail

                }
                await (await this.OrdersService.sendEmail(emailObj)).toPromise()
                const smsMsg = 
                `Dear ${responseData['senderName']},It is with great pleasure that we wish to inform you that ${responseData['projectName']} at ${responseData['location']} has been completed. Your contribution has helped in making this possible and will further help in maintainance of this project.- MakeMyTrip Foundation`
                const smsQuery =  `phoneNumber=${responseData['senderPhoneNumber']}&smsText=${smsMsg}`
                await (await this.OrdersService.SendSms(smsQuery)).toPromise()
              }
          

              if (data['report']) {
                const orderData = await (await this.OrdersService.getOrdersListByID(data._id)).toPromise()
                console.log('orderData', orderData)
                const responseData = orderData['data'][0]


                const sendEmail = `                
                

                Dear ${responseData['receiverName']},
                <br><br>
                
                Greetings from MakeMyTrip Foundaition.
                <br><br>
                On the occasion of your event, ${responseData['senderName']} has made a contribution on your behalf towards the maintenance of the ${responseData['projectName']} at ${responseData['location']} . We wish you loads of happiness. 
                
                An E card With message from ${responseData['senderName']} has been attached here.
                
                Team MakeMytrip Foundation 
                
                `
                const emailObj = {
                  "to": responseData['receiverEmailId'],
                  "subject": "Warm wishes from " + responseData['senderName'],
                  "text": sendEmail,
                  "html": sendEmail

                }
                await (await this.OrdersService.sendEmail(emailObj)).toPromise()

              }
              console.log(response);
              // this.commonService.showProcessingToastOff();
              this.commonService.successToast('Orders updated successfully');
              setTimeout(() => {
                this.getOrdersTableData();
              }, 1000);
            },
            (error) => {
              console.log(error);
              this.commonService.showProcessingToastOff();
              this.commonService.errorToast(error.message);
            }
          );
        } else {
          // this.commonService.showProcessingToastOn();
          this.OrdersService.addNewOrders(data).subscribe(
            (response: any) => {
              console.log(response);
              // this.commonService.showProcessingToastOff();
              this.commonService.successToast('Orders added successfully');
              setTimeout(() => {
                this.getOrdersTableData();
              }, 1000);
            },
            (error) => {
              console.log(error);
              // this.commonService.showProcessingToastOff();
              this.commonService.errorToast(error.message);
            }
          );
        }
      }
    });
  }

  openViewOrdersDrawer(OrdersObj) {
    const viewdrawerRef = this.drawerService.create<
      CommonnViewDrawerComponent,
      { value: Object; title: string; category: string },
      string
    >({
      nzTitle: 'Orders view',
      // nzFooter: 'Footer',
      nzWidth: '1000px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: OrdersObj,
        title: 'Orders',
        category: 'orders-view',
      },
    });

    viewdrawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    viewdrawerRef.afterClose.subscribe((data) => {
      console.log(data);
      if (typeof data === 'string') {
        // this.responseData = data;
      }
    });
  }

  async dataTableActions(Orders) {
    console.log(Orders.label);
    console.log(Orders);

    if (Orders.label === 'View') {
      this.openViewOrdersDrawer(Orders.data);
    } else if (Orders.label === 'Edit') {
      this.isUpdate = true;
      this.openNeworEditOrdersDrawer(
        Orders.data,
        'Update Orders',
        'Update Orders',
        false
      );
    } else if (Orders.label === 'Delete') {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete ' + Orders.data.OrdersName,
        nzOnOk: () => {
          console.log('delete record ');
          this.deleteOrders(Orders.data._id);
        },
      });
    }
  }

  async deleteOrders(id) {
    this.commonService.showProcessingToastOn();
    (await this.OrdersService.deleteOrders(id)).subscribe(
      (response: any) => {
        console.log(response);
        this.commonService.showProcessingToastOff();
        this.commonService.successToast('Orders deleted successfully');
        setTimeout(() => {
          this.getOrdersTableData();
        }, 1000);
      },
      (error) => {
        console.log(error);
        this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message);
      }
    );
  }

  dataTableHeaderActions(Orders) {
    console.log(Orders);
    if (Orders.label === 'Add') {
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

  async getOrdersTableData() {
    this.commonService.showProcessingToastOn();
    (await this.OrdersService.getOrdersList()).subscribe(
      (response: any) => {
        console.log(response);
        this.tableData = response.data;

        this.commonService.showProcessingToastOff();
        this.refreshDatatable();
      },
      (error) => {
        console.log(error);
        // this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message);
      }
    );
  }

  refreshDatatable() {
    this.dataTable = false;
    setTimeout(() => {
      this.dataTable = true;
    }, 100);
  }
}

function subscribe(arg0: (response: any) => void) {
  throw new Error('Function not implemented.');
}

