import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

 
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
      label: 'Policy Number',
      key: 'policy_number',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Start Date',
      key: 'start_date',
      checked: true,
      sortable: true,
      sortDir: 'desc',
    },
    {
      label: 'Tpa List',
      key: 'tpaList',
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
  public tableData: any[] = [
    {
      "policy_number": "304000411",
      "start_date": "2021-03-31",
      "end_date": "2022-03-30T00:00:00+05:30",
      "tpaList": 25
      },
      {
      "policy_number": "304000428",
      "start_date": "2021-04-09",
      "end_date": "2022-04-08T00:00:00+05:30",
      "tpaList": 25
      }
  ];
  public dataTablePage = 1;
  responseData: string;
  constructor(private drawerService: NzDrawerService,  private apiService : ApiService) { }

  ngOnInit(): void {
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

      this.apiService.successToast();
      this.apiService.errorToast();

      if (typeof data === 'string') {
        this.responseData = data;
      }
    });
  }



  async dataTableActions(event) {
    console.log(event);
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
}
