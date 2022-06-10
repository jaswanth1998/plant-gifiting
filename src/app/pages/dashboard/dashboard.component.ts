import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public accStatementHeaderButtons: any[] = [
    {
      label: 'Upload',
    },
    {
      label: 'Add',
    },
  ];
  public accountStatementHeaders: any[] = [
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
  public accountStatements: any[] = [
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
  public accStatementPage = 1;
  constructor() { }

  ngOnInit(): void {
  }

  async accStatementActions(event) {
    console.log(event);
  }

  accStatementHeaderActions(event) {
    console.log(event);
  }

  reloadAccStatementTable(page?) {
    // this.accStatementPage = page || 1;
    // this.showStatementTable = false;
    // setTimeout(() => {
    //   this.showStatementTable = true;
    // }, 500);
  }
}
