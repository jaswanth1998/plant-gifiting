import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { EcardService } from './ecard.service';

@Component({
  selector: 'app-ecard',
  templateUrl: './ecard.component.html',
  styleUrls: ['./ecard.component.scss']
})
export class EcardComponent implements OnInit {

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
      label: 'Ecard name',
      key: 'ecardName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'is Live',
      key: 'isLive',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Open For',
      key: 'openFordata',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    // {
    //   label: 'HTML',
    //   key: 'html',
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
  public eventsData = undefined;
  public dataTablePage = 1;
  dataTable = false;
  isUpdate = false;
  constructor(
  private drawerService: NzDrawerService, 
  private EcardService : EcardService,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getEcardTableData();
  }


  openNeworEditEcardDrawer(data = {}, title = "Add Ecard",  button = 'Add Ecard', isNew = true){
    console.log(title,button,isNew)
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string, isNew : boolean }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'ecard',
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
          this.EcardService.updateEcard(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Ecard updated successfully");
            setTimeout(() => {
              this.getEcardTableData()
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
          
          this.EcardService.addNewEcard(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Ecard added successfully");
            setTimeout(() => {
              this.getEcardTableData();
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

  openViewEcardDrawer(EcardObj){
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'Ecard view',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: EcardObj,
        title : 'Ecard',
        category : 'ecard-view'
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


  async dataTableActions(Ecard) {
    console.log(Ecard.label);
    console.log(Ecard);

    if(Ecard.label === 'View'){ 

      this.openViewEcardDrawer(Ecard.data)

    }else if (Ecard.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditEcardDrawer(Ecard.data, 'Update Ecard', 'Update Ecard', false);

    }else if (Ecard.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+Ecard.data.ecardName,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteEcard(Ecard.data._id);
          
        }
          
      });
    }
  }


 async deleteEcard(id){
  this.commonService.showProcessingToastOn();
    (await this.EcardService.deleteEcard(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("Ecard deleted successfully");
      setTimeout(() => {
        this.getEcardTableData()
      }, 1000);
      },
      (error)=>{
        console.log(error)
        this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message)
      });
  }

  
  dataTableHeaderActions(Ecard) {
    console.log(Ecard);
    if(Ecard.label === 'Add'){
      this.isUpdate = false;
    this.openNeworEditEcardDrawer();
    }
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


 async getEcardTableData(){
    this.commonService.showProcessingToastOn();
    (await this.EcardService.getEcardList()).subscribe(async (response: any) =>{
    console.log(response)
    this.tableData = response.data;
    
    (await this.EcardService.getEventsList()).subscribe((response: any) =>{
      console.log(response);
      this.eventsData = response.data;

      
    this.tableData.forEach( (ecard)=>{
      console.log(ecard);
      if(ecard.openFor[0] !== "NA"){
        let listOfNames = "";



        ecard.openFor.forEach(evntid => {
          const index = this.eventsData.findIndex(evnt => evnt._id === evntid);
          console.log(index)
          if(index >= 0){
            if(listOfNames === ""){
              if( this.eventsData[index]['isLive'].toLowerCase() === 'yes'){
                listOfNames = this.eventsData[index]['eventName'];
              }else{
                listOfNames = 'inactive :('+ this.eventsData[index]['eventName']+') ';
              }
            }
            
          else{
            if( this.eventsData[index]['isLive'].toLowerCase() === 'yes'){
              listOfNames = listOfNames + ', ' + this.eventsData[index]['eventName'];
            }else{
              listOfNames = listOfNames + ', inactive :(' + this.eventsData[index]['eventName'] +') ';
            }
          }
           
  
          console.log(listOfNames);
          ecard.openFordata = listOfNames;
          }
          
        });
      }else{
        ecard.openFordata = "Not available"
      }
     
      this.commonService.showProcessingToastOff();
      this.refreshDatatable();
    });
  
    });

    
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

