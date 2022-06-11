import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { TreeService } from './tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  confirmModal?: NzModalRef; 
  public HeaderButtons: any[] = [
    {
      label: 'Upload',
    },
    {
      label: 'Add',
    },
  ];
  public tableHeaders: any[] = [
    {
      label: 'image',
      key: 'icon',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
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
  public tableData: any[] = [
    {
      "_id": "62a41c467c2554a008ea5d16",
      "treeName": "tree namee",
      "primaryTag": [
          "test"
      ],
      "secondaryTag": [
          "testsecondayTag"
      ],
      "icon": "url",
      "images": [
          "urls1",
          "urls2",
          "urls3"
      ],
      "isLive": "true",
      "treeIntroduction": "treeIntroduction",
      "__v": 0
  },
  {
      "_id": "62a41f477c2554a008ea5d19",
      "treeName": "test",
      "primaryTag": [
          "test"
      ],
      "secondaryTag": [
          "testsecondayTag"
      ],
      "icon": "url",
      "images": [
          "urls1",
          "urls2",
          "urls3"
      ],
      "isLive": "true",
      "treeIntroduction": "treeIntroduction",
      "__v": 0
  }
  ];
  public dataTablePage = 1;
  responseData: string;
  constructor(
  private drawerService: NzDrawerService, 
  private treeService : TreeService,
  private modal: NzModalService) { }

  ngOnInit(): void {

    this.getTreeTableData();
  }


  openDrawer(){
    const drawerRef = this.drawerService.create<CommonDrawerComponent, { value: string }, string>({
      nzTitle: 'Add Tree',
      // nzFooter: 'Footer',
      nzWidth : '550px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
        value: 'Create new plant'
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      console.log(data);
      if (typeof data === 'string') {
        this.responseData = data;
      }
    });
  }



  async dataTableActions(event) {
    console.log(event.label);

    if(event.label === 'View'){

    }else if (event.label === 'Edit'){

    }else if (event.label === 'Delete'){

      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete '+event.data.treeName,
        nzOnOk: () => {
          console.log('delete record ')
          this.treeService.deleteTree(event.data._id);
        }
          
      })
    }
  }

  dataTableHeaderActions(event) {
    console.log(event,'pop oon ');
    this.openDrawer();
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }


  getTreeTableData(){
   console.log(this.treeService.getTreeList());
  }

}
