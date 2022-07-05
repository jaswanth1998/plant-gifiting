import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { EventService } from '../events/event-service.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

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
      label: 'Event name',
      key: 'eventName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'is Live',
      key: 'isLive',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    // {
    //   label: 'Event image',
    //   key: 'eventImage',
    //   checked: true,
    //   sortable: true,
    //   sortDir: 'desc',
    //   filter: true,
    // },
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
  private EventService : EventService,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getEventTableData();
  }


  openNeworEditEventDrawer(data = {}, title = "Add Event",  button = 'Add Event', isNew = true){
    console.log(title,button,isNew)
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string, isNew : boolean }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'event',
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
          this.EventService.updateEvent(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Event updated successfully");
            setTimeout(() => {
              this.getEventTableData()
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
          this.EventService.addNewEvent(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Event added successfully");
            setTimeout(() => {
              this.getEventTableData();
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

  openViewEventDrawer(EventObj){
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'Event view',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: EventObj,
        title : 'Event',
        category : 'event-view'
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

      this.openViewEventDrawer(event.data)

    }else if (event.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditEventDrawer(event.data, 'Update Event', 'Update Event', false);

    }else if (event.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+event.data.eventName,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteEvent(event.data._id);
          
        }
          
      });
    }
  }


 async deleteEvent(id){
  this.commonService.showProcessingToastOn();
    (await this.EventService.deleteEvent(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("Event deleted successfully");
      setTimeout(() => {
        this.getEventTableData()
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
      this.isUpdate = false;
    this.openNeworEditEventDrawer();
    }
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


 async getEventTableData(){
    this.commonService.showProcessingToastOn();
    (await this.EventService.getEventList()).subscribe((response: any) =>{
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

