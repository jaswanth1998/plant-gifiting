import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { QueriesService } from './queries-service.service';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent implements OnInit {
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
      label: 'Phone no',
      key: 'phoneNo',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Email',
      key: 'email',
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
      filter: true,
    },
    {
      label: 'Query',
      key: 'query',
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
      controls: [{ label: 'View' },{ label: 'Edit' }],
    },
  ];
  public tableData = undefined;
  public dataTablePage = 1;
  dataTable = false;
  isUpdate = false;
  constructor(
  private drawerService: NzDrawerService, 
  private QueriesService : QueriesService,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getQueriesTableData();
  }


  openNeworEditQueriesDrawer(data = {}, title = "Add Queries",  button = 'Add Queries', isNew = true){
    console.log(title,button,isNew)
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string, isNew : boolean }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'Queries',
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
          this.QueriesService.updateQueries(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Queries updated successfully");
            setTimeout(() => {
              this.getQueriesTableData()
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
          this.QueriesService.addNewQueries(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Queries added successfully");
            setTimeout(() => {
              this.getQueriesTableData();
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

  openViewQueriesDrawer(QueriesObj){
    console.log(QueriesObj)
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'Queries view',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: QueriesObj,
        title : 'Queries',
        category : 'queries-view'
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


  async dataTableActions(Queries) {
    console.log(Queries.label);
    console.log(Queries);

    if(Queries.label === 'View'){ 

      this.openViewQueriesDrawer(Queries.data)

    }else if (Queries.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditQueriesDrawer(Queries.data, 'Update Queries', 'Update Queries', false);

    }else if (Queries.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+Queries.data.QueriesName,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteQueries(Queries.data._id);
          
        }
          
      });
    }
  }


 async deleteQueries(id){
  this.commonService.showProcessingToastOn();
    (await this.QueriesService.deleteQueries(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("Queries deleted successfully");
      setTimeout(() => {
        this.getQueriesTableData()
      }, 1000);
      },
      (error)=>{
        console.log(error)
        this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message)
      });
  }

  
  dataTableHeaderActions(Queries) {
    console.log(Queries);
    if(Queries.label === 'Add'){
      this.isUpdate = false;
    this.openNeworEditQueriesDrawer();
    }
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


 async getQueriesTableData(){
    this.commonService.showProcessingToastOn();
    (await this.QueriesService.getQueriesList()).subscribe((response: any) =>{
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

