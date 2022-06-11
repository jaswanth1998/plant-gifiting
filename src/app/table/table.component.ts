// import { RolesService } from 'src/app/services/roles/roles.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { ApiService } from '../services/api/api.service';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationEnd, Router } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input('headers') headers: any[];
  @Input('headerButtons') headerButtons: any[] = [];
  // @Input('url') url: any;
  @Input('tableData') tableData: any;
  @Input('defaultColumn') defaultColumn: any;
  @Input('dir') dir: any;
  @Input('showFilters') showFilters: boolean = true;
  @Input('page') page: any = 1;
  @Input('showExport') showExport: boolean = true;
  @Input('showCheckbox') showCheckbox: boolean = false;
  @Input('showDateFilter') showDateFilter: boolean = false;
  @Input('dateFilterColumn') dateFilterColumn: any = 'createdOn';
  @Input('addPagination') addPagination: boolean = true;
  @Input('monthFilter') monthFilter: boolean = false;
  @Input('filterByMonth') filterByMonth: boolean = false;
  @Input('excelName') excelName: any = 'data';
  @Input('buttonPermission') buttonPermission: boolean = true;
  @Output('headerActions') headerActions = new EventEmitter();
  @Output('actions') actions = new EventEmitter();
  @Output('format') format = new EventEmitter();
  @Output('emitter') emitter = new EventEmitter();

  data: any = [];
  total: any;
  searchBy: any;
  searchValue: any = '';
  filteredData: any;
  public showPagination: boolean = false;
  public months: any[] = ["All", "January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];
  public selectedMonth: any = 'All';
  public date: any = [];
  showBtnsWithoutPerm: boolean;

  constructor(private spinner: NgxSpinnerService, 
    // private 
    // rolesService: RolesService, 
    private router: Router) {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const url = this.router.url;
        console.log(url.split('/'));

        if (
          url.split('/').length > 1
            ? url.split('/')[1] == 'roles'
            : url.split('/')[0] == 'roles'
        ) {
          this.showBtnsWithoutPerm = true;
        }
      }
    });
  }

  async ngOnInit() {
    if (this.monthFilter) {
      if (this.filterByMonth) {
        let date = new Date();
        this.selectedMonth = moment(date).format('MMMM');
      }
    }
    // if (this.headerButtons && this.headerButtons.length && this.buttonPermission) {
    //   await this.getButtonPermissions();
    // }
    this.getData();
  }

  async getButtonPermissions() {
    const headerButtons = JSON.parse(JSON.stringify(this.headerButtons));
    console.log('header buttons befor premissions', headerButtons);
    if (this.showBtnsWithoutPerm) {
      headerButtons.forEach((ele: any) => {
        console.log('show buttons without permissions');
        ele.show = true;
      });
      this.headerButtons = headerButtons;
      return;
    }
    // const res: any = await this.rolesService.enableModules(headerButtons);
    // console.log('response from permission', res);
    // this.headerButtons = res;
  }

  async getData() {
    // this.spinner.show();
    // const res: any = await this.apiRequest.get(this.url).toPromise();
    // this.spinner.hide();
    const staticFields = {};
    this.headers.map((ele) => {
      if (ele.static) {
        staticFields[ele.key] = ele.static;
        staticFields['staticControls'] =
          ele.controls && JSON.parse(JSON.stringify(ele.controls));
      }
      if (ele.addStyles) {
        staticFields['styles'] =
          ele.styles && JSON.parse(JSON.stringify(ele.styles));
      }
    });
    const data = [...this.tableData];
    data.forEach((elem: any, i) => {
      if (this.showCheckbox) elem.checked = false;
      if (staticFields['staticControls']) {
        elem['staticControls'] = JSON.parse(
          JSON.stringify(staticFields['staticControls'])
        );
        elem.staticControls.forEach((element: any) => {
          element.show = true;
        });
      }
      if (staticFields['styles']) {
        elem.styles = JSON.parse(JSON.stringify(staticFields['styles']));
      }
    });
    this.data = _.orderBy(data, this.defaultColumn, this.dir);
    if (this.selectedMonth == 'All') {
      this.filteredData = _.orderBy(data, this.defaultColumn, this.dir);
    } else {
      this.filteredData = this.data.filter(ele => moment(ele[this.dateFilterColumn]).format('MMMM') == this.selectedMonth);
    }
    this.total = this.filteredData.length;
    this.showPagination = false;
    setTimeout(() => {
      this.showPagination = true;
    }, 500);
    setTimeout(() => {
      this.format.emit(this.data);
    }, 10);

    console.log(this.filteredData);
    console.log(this.data);
  }
  sort(item: any) {
    if (item.sortable) {
      if (item.sortDir == 'desc') {
        const filteredData = _.orderBy(this.filteredData, item.key, 'desc');
        this.filteredData = filteredData;
        item.sortDir = 'asc';
      } else {
        const filteredData = _.orderBy(this.filteredData, item.key, 'asc');
        this.filteredData = filteredData;
        item.sortDir = 'desc';
      }
    }
  }
  action(name, data) {
    this.actions.emit({ label: name, data, page: this.page });
  }
  onEmitter(header, data: any) {
    this.emitter.emit({ label: header, data, page: this.page });
  }
  buttonClick(item: any) {
    console.log(item);
    let label = item.label || item.lable || '';
    if (label.toLowerCase() == 'export') {
      this.exportToExcel();
    } else {
      item = {...item, data: this.data}
      this.headerActions.emit(item);
    }
  }

  onCheckChange(event) {
    this.data.forEach((ele) => {
      ele.checked = event;
    });
    this.filteredData.forEach((ele) => {
      ele.checked = event;
    });
  }

  async filterData() {
    console.log(this.searchBy, this.searchValue);
    // await this.getData();
    const data = this.data;
    if (this.searchValue == '') {
      // this.getData()
      this.filteredData = data;
    } else {
      const fData = this.data.filter(
        (e: any) =>
          e[this.searchBy] &&
          e[this.searchBy].toLowerCase().match(this.searchValue.toLowerCase())
      );
      this.filteredData = fData;
    }
    this.page = 1;
  }

  onDateChange(event) {
    console.log(this.date);
    console.log(this.dateFilterColumn);
    if (this.date.length) {
      let startDate = moment(event[0]).unix();
      let endDate = moment(event[1]).unix();
      console.log(startDate, endDate, moment("2021-12-08T16:08:53.000Z").unix())
      let data = this.data;
      let fData = data.filter(ele => {
        // console.log(ele[this.dateFilterColumn]);
        return moment(ele['createdOn']).unix() > startDate && moment(ele['createdOn']).unix() < endDate
      });
      this.filteredData = fData;
    } else {
      this.filteredData = this.data;
    }
  }

  monthFilterCgange(event) {
    let data = [...this.data];
    this.spinner.show();
    setTimeout(() => {
      if (event == 'All') {
        this.filteredData = data;
      } else {
        this.filteredData = data.filter(ele => moment(ele[this.dateFilterColumn]).format('MMMM') == this.selectedMonth);
      }
      this.total = this.filteredData.length;
      this.spinner.hide();
    }, 1000);
  }

  exportToExcel() {
    const excelData = [];
    for (let data of this.tableData) {
      const obj: any = {};
      for (let hed of this.headers) {
        if (hed.label != 'Action' && hed.checked) {
          obj[hed.label] = hed.actual_key
            ? (data[hed.actual_key] ? data[hed.actual_key] : '')
            : (hed.sub_key ?  (data[hed.key][hed.sub_key] ?  data[hed.key][hed.sub_key] : '') 
            : (data[hed.key] ? data[hed.key] : ''));
        }
      }
      excelData.push(obj);
    }
    console.log(excelData);
    var workSheet = XLSX.utils.json_to_sheet(excelData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, 'Sheet1');
    XLSX.writeFile(wb, `${this.excelName}.xlsx`);
  }
}
