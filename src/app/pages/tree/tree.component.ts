import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { timeout } from 'rxjs/operators';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { TreeService } from './tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

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
      label: 'Tree name',
      key: 'treeName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Is live',
      key: 'isLive',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Primary tag',
      key: 'primaryTag',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Secondary tag',
      key: 'secondaryTag',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Tree Introduction',
      key: 'treeIntroduction',
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
  private treeService : TreeService,
  private modal: NzModalService,
  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.getTreeTableData();
  }


  openNeworEditTreeDrawer(data = {}, title = "Add Tree",  button = 'Add tree', isNew = true){
    const editdrawerRef = this.drawerService.create<CommonDrawerComponent, { value: Object, button : string, category : string, isNew : boolean }, Object>({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
          value : data,
          category : 'tree',
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
          this.treeService.updateTree(data._id,data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Tree updated successfully");
            setTimeout(() => {
              this.getTreeTableData()
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
          this.treeService.addNewTree(data).subscribe((response: any) =>{
            console.log(response);
            // this.commonService.showProcessingToastOff();
            this.commonService.successToast("Tree added successfully");
            setTimeout(() => {
              this.getTreeTableData();
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

  openViewTreeDrawer(treeObj){
    const viewdrawerRef = this.drawerService.create<CommonnViewDrawerComponent, { value: Object, title : string,  category : string  }, string>({
      nzTitle: 'Tree view',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: treeObj,
        title : 'tree',
        category : 'tree-view'
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

      this.openViewTreeDrawer(event.data)

    }else if (event.label === 'Edit'){

      this.isUpdate = true;
      this.openNeworEditTreeDrawer(event.data, 'Update Tree', 'Update Tree', false);

    }else if (event.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+event.data.treeName,
        nzOnOk: () => {
          console.log('delete record ')
          this.deleteTree(event.data._id);
          
        }
          
      });
    }
  }


 async deleteTree(id){
  this.commonService.showProcessingToastOn();
    (await this.treeService.deleteTree(id)).subscribe((response: any) =>{
      console.log(response);
      this.commonService.showProcessingToastOff();
      this.commonService.successToast("Tree deleted successfully");
      setTimeout(() => {
        this.getTreeTableData()
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
    this.openNeworEditTreeDrawer();
    }
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


 async getTreeTableData(){
    this.commonService.showProcessingToastOn();
    (await this.treeService.getTreeList()).subscribe((response: any) =>{
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

