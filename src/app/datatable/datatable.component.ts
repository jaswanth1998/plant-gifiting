import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  HostListener,
  ContentChild,
  TemplateRef,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SortableListComponent } from '../sortable-list/sortable-list.component';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { environment } from '../../../../../../apps/purohit-admin/src/environments/environment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatatableService } from './datatable.service';
import { Subscription } from 'rxjs';

const noop = () => {};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatatableComponent),
  multi: true
};

@Component({
  selector: 'purohit-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DatatableComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  datatableData: any;
  base64Img: any = '';
  monitorLoader = false;
  exportDataExcel: any;
  exportDataPDF: any;
  options: any = {};
  API_ENDPOINT = environment.API_ENDPOINT;
  @ContentChild(TemplateRef, { static: false }) templateRef;
  @ContentChild('tool', { static: false }) tool: TemplateRef<any>;
  mouseActive: any;
  @ViewChild('selectedElement', { static: false }) selectedElement: ElementRef;
  @ViewChild(SortableListComponent, { static: false })
  sortElement: SortableListComponent;
  public popoverPlacement = 'bottom';
  selectedRowEle: Number;
  setClickedRow: Function;
  checkedFinalList: any = [];
  preferencesDropdown: any;
  mainHeader: any;
  mainData: any;
  sortDirection: any;
  filterType: any;
  filterName: any;
  sortColumn: any;
  sortByColumn: any;
  pagination: any = {
    page: 1,
    totalRecords: 10,
    maxResults: 10
  };
  selectAll: any;
  private innerValue: any = '';
  @Input() sapLoader: boolean;
  @Input() set rowsLimit(val: number) {
    this.pagination.maxResults = val;
  }
  @Input() headers: any;
  @Input() ngModel: any;
  @Input() url: string;
  @Input() defaultColumn: string;
  @Input() dir: string;
  @Input() method: string;
  @Input() body: any;
  @Input() preferences: boolean;
  @Input() export: any;
  @Input() hideExport: any;
  @Input() showTopPagination: boolean;
  @Input() hideBottomPagination: boolean;
  @Input() limitSelection: any;
  @Input() noRecordMsg: any = 'No records found';
  @Input() monitorTable = false;

  @Output() preferenceChange = new EventEmitter();
  @Output() inlineUpdate = new EventEmitter();
  @Output() actions = new EventEmitter();
  @Output() staticAction = new EventEmitter();
  @Output() formatter = new EventEmitter();
  @Output() totalFormatter = new EventEmitter();
  @Output() nodeAction = new EventEmitter();
  @Input() selectable;
  @Input() title: string;
  @Output() popoverData = new EventEmitter();
  @Output() recordSelected = new EventEmitter();
  @Output() selectedRecords = new EventEmitter();
  @Input() hidetitle: boolean;
  @Input() hidetotalRecords: boolean;
  @Input() hidePdf: boolean;
  @Input() hideExcel: boolean;
  @Input() hidePrint: boolean;
  @Input() showExcelTemplate: Boolean = false;
  @Input() showBarCodeIcon: Boolean = false;
  @Output() barcodeAction = new EventEmitter();
  @Input() sortDisable = true;
  @Input() selectList: any = [];
  @Input() multiSelectText: any;
  @Input() multiSelectWidth: any;
  @Output() mutliSelectRecord = new EventEmitter();
  @Input() activeRow = false;
  @Input() selectSelectAll: boolean;
  @Input() isReport: boolean;
  @Input() exportTitle: any;
  @Input() fileName: any;
  @Input() reportFromDate: any;
  @Input() reportToDate: any;
  @Input() reportFontSize: any;
  @Input() reportHeaderOverflow: any;
  @Input() reportBodyOverflow: any;
  @Input() reportCellAlign: any;
  @Input() reportTestType: any;
  @Input() reportProtocol: any;
  @Input() flatability = false; // to convert to flat obj
  @Output() flatEmiter = new EventEmitter(); // to convert to flat obj
  datatableServiceCall: Subscription;
  @Input() set updateTable(value: any) {
    if (value) {
      this.loadResults();
    }
  }

  selectListData: any;
  editableRowNum: any;

  public popoverContent: any;
  public timer: any;
  public randomNumber: number;

  constructor(
    private componentService: DatatableService,
    public router: Router,
    private ref: ChangeDetectorRef,
    private excelService: DatatableService
  ) {
    ref.detach();
    this.timer = setInterval(() => {
      this.ref.detectChanges();
    }, 500);
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
    this.datatableServiceCall.unsubscribe();
  }

  ngOnChanges() {
    if (this.selectSelectAll) {
      this.selectAll = true;
    }
    this.innerValue =
      this.pagination &&
      this.pagination.data &&
      this.pagination.data.filter(function(data) {
        return data.select;
      });
    this.ngModel = this.innerValue;
    this.onChangeCallback(this.innerValue);
  }
  afterResize() {}
  ngOnInit() {
    console.log('sortDisable ::: ', this.sortDisable);
    this.options = {
      disabled: this.sortDisable,
      onUpdate: (event: any) => {
        console.log(event);
      }
    };

    console.log(moment(new Date().getTime()).unix());

    this.randomNumber = Math.random();
    this.preferencesDropdown = [];
    this.headers.forEach(ele => {
      if (ele.label && ele.label !== 'Options') {
        this.preferencesDropdown.push(ele);
      }
    });
    console.log(this.headers);
    this.loadResults();
  }
  ngAfterViewInit() {}
  autoFocusSelect($event) {
    $($event.currentTarget).addClass('inline-active');
    setTimeout(() => {
      // tslint:disable-next-line: no-unused-expression
      this.selectedElement && this.selectedElement.nativeElement.focus();
    }, 500);
  }
  sortChange($event) {
    this.preferenceChange.emit($event);
  }
  loadHeaders() {
    // tslint:disable-next-line: no-unused-expression
    this.headers &&
      this.headers.forEach((element, i) => {
        element.id = i;
      });
  }
  checkedHeaders() {
    const checkedList = this.headers.filter(function(ele) {
      return ele.checked;
    });
    return checkedList;
  }
  loadResults() {
    if (this.monitorTable) {
      this.monitorLoader = true;
    } else {
      /* if (this.sapLoader) {
        this.sapSpinner.show();
      } else {
        this.spinnerService.show();
      } */
    }
   console.log(this.pagination.page);
    const startIndex = (this.pagination.page-1)*this.pagination.maxResults;
    this.pagination.maxResults = this.pagination.maxResults
      ? this.pagination.maxResults
      : 5;

    const data = {
      startIndex: startIndex,
      endIndex: this.pagination.maxResults,
      sortByColumn: this.sortByColumn ? this.sortByColumn : this.defaultColumn,
      sortDirection: this.sortDirection ? this.sortDirection : this.dir
    };
    this.setClickedRow = function(index) {
      if (this.activeRow === true) {
        this.selectedRowEle = index;
      }
    };
    this.datatableServiceCall = this.componentService
      .getDataTableData(this.url, data, this.method, this.body)
      .subscribe(
        // tslint:disable-next-line: no-shadowed-variable
        data => {
          if (Object.keys(data).length && data.response && data.response.rows) {
            this.pagination.totalRecords = data.response.totalRecords;
            this.pagination.data = Array.isArray(data.response.rows)
              ? data.response.rows
              : [data.response.rows];
            this.pagination.data.forEach((ele, index) => {
              ele['rnum'] = startIndex + index + 1;
            });
            this.pagination.otherFields = JSON.parse(
              JSON.stringify(data.response)
            );
            delete this.pagination.otherFields.rows;
            const staticFields = {};
            const options = {};
            const customTemplate = {};
            const editableFields = {};

            this.headers.map(ele => {
              // console.log(ele);

              if (ele.static && !ele.clickable) {
                ele.width = ele.width ? ele.width : 55;
                staticFields[ele.key] = ele.static;
                staticFields['staticControls'] =
                  ele.controls && JSON.parse(JSON.stringify(ele.controls));
                staticFields['showAll'] = ele.showAll;
              }
              if (ele.clickable) {
                ele.static = ele.key;
              }
              if (ele.editable && ele.editableType === 'select') {
                options[ele.key] = ele.editableSchema;
              }
              if (ele.customTemplate) {
                customTemplate[ele.key] = ele.jsonKeys;
              }

              if (ele.editable) {
                this.pagination.data.forEach(ele1 => {
                  if (!ele1.hasOwnProperty(ele.key)) {
                    ele1[ele.key] = '';
                  }
                });
                editableFields[ele.key] = JSON.parse(
                  JSON.stringify({
                    editable: ele.editable,
                    editableType: ele.editableType,
                    defaultInline: ele.defaultInline,
                    inlineText: ele.inlineText
                  })
                );
              }
            });

            const selectedRows = this.checkedFinalList.map(ele => {
              return ele.rnum || ele.RNUM;
            });
            console.log('selectedRows', selectedRows);
            this.pagination.data.forEach(ele => {
              if (
                (ele.rnum && selectedRows.indexOf(ele.rnum) !== -1) ||
                (ele.RNUM && selectedRows.indexOf(ele.RNUM) !== -1)
              ) {
                ele.select = true;
              }
              ele.inlineSelectOptions = {};

              // tslint:disable-next-line: forin
              for (const i in options) {
                ele.inlineSelectOptions[i] = options[i];
              }
              ele.customTemplateJson = {};

              for (const i in customTemplate) {
                if (ele.hasOwnProperty(i)) {
                  customTemplate[i].forEach(tem => {
                    if (!ele.customTemplateJson[i]) {
                      ele.customTemplateJson[i] = {};
                    }
                    ele.customTemplateJson[i][tem] = {};
                  });
                }
              }
              ele.inlineEdit = {};
              for (const i in editableFields) {
                if (ele.hasOwnProperty(i)) {
                  ele.inlineEdit[i] = JSON.parse(
                    JSON.stringify(editableFields[i])
                  );
                }
              }
              ele.columnStyle = {};
              ele.columnTitle = {};
              ele.columnCssClass = {};
              ele.disabledColumn = {};
              ele = $.extend(ele, JSON.parse(JSON.stringify(staticFields)));
            });
            console.log(this.pagination.data);

            this.mainData = JSON.parse(JSON.stringify(data.response.rows));
            console.log(this.mainData);
            this.innerValue = this.pagination.data.filter(innerValue => {
              return innerValue.select;
            });
            this.ngModel = this.innerValue;
            this.onChangeCallback(this.innerValue);
            this.selectedRecords.emit(this.checkedFinalList);
            console.log('this.checkedFinalList', this.checkedFinalList);
          } else {
            this.pagination.data = [];
          }
          setTimeout(() => {
            if (this.monitorTable) {
              this.monitorLoader = false;
            } else {
              /*  if (this.sapLoader) {
                this.sapSpinner.hide();
              } else {
                this.spinnerService.hide();
              } */
            }
          }, 500);
          this.formatter.emit(this.pagination.data);
          this.totalFormatter.emit(this.pagination);
        },
        error => {
          setTimeout(() => {
            if (this.monitorTable) {
              this.monitorLoader = false;
            } else {
              /*   if (this.sapLoader) {
                this.sapSpinner.hide();
              } else {
                this.spinnerService.hide();
              } */
            }
          }, 500);
        }
      );
  }
  openTooltip(myTip) {
    $('.tooltip').hide();
    setTimeout(function() {
      $('#' + myTip._ngbTooltipWindowId).show();
      // myTip.open();
    }, 10);
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!$(event.target).closest('.tooltip')[0]) {
      $('.tooltip').hide();
    }
    if (
      !$(event.target).closest('.sortable-datatable-list')[0] &&
      this.preferences
    ) {
      if (this.sortElement) this.sortElement.close();
      //$(".sortable-datatable-list").find(".dropdown-menu.show").removeClass("show");
    }
  }
  @HostListener('mousedown', ['$event'])
  mouseDown(event) {
    this.mouseActive = event.target;
  }
  @HostListener('mousemove', ['$event'])
  mouseMove(event) {}
  pageChanged($event) {
    console.log($event);
    this.pagination.page = $event.page;
    this.selectAll = false;
    this.loadResults();
  }
  changeMaxSize() {
    this.pagination.page = 1;
    this.loadResults();
  }
  sortColumnData(column) {
    if (column.key !== this.sortByColumn && !column.dir) {
      this.headers.forEach(element => {
        element.dir = false;
      });
      this.sortDirection = 'DESC';
    } else {
      this.sortDirection = column.dir ? 'ASC' : 'DESC';
    }
    column.dir = !column.dir;

    this.sortByColumn = column.key;
    this.pagination.page = 1;
    this.loadResults();
  }
  getColor(type, label, schema) {
    if (type === 'button') {
      let clr;
      schema.forEach(element => {
        if (element.key === label) {
          clr = element.color;
        }
      });
      return clr;
    }
  }
  getSanitizeText(text) {
    if (text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      return div.textContent;
    }
  }
  isArray(data) {
    return Array.isArray(data);
  }
  getParams(item, header) {
    const params = header.linkParam.split(',');
    const str = {};
    params.forEach(element => {
      str[element] = item[element.trim()];
    });
    if (header.concatObj) {
      return $.extend(str, header.concatObj);
    } else {
      return str;
    }
  }
  editColumn($event /*, header, item*/) {
    // header.contentEditable = true;
    /* if (header.editableType == "select") {
       let select = document.createElement("select");
       for (let i = 0; i < header.editableSchema.length; i++) {
         let option = document.createElement("option");
         option.value = header.editableSchema[i].id;
         option.textContent = header.editableSchema[i].name;
         select.appendChild(option);
       }
       select.addEventListener("change", function () {
         let selected = header.editableSchema[<any>this.value-1];
         item[header.key] = selected.name;
       });
 
       $($event.currentTarget).parent().append(select);
     }*/
  }
  onSelectChange($event, item, schema, key, index, headerIndex, type) {
    this.inlineUpdate.emit({
      value: item,
      selected: schema[$event.currentTarget.selectedIndex],
      type: type,
      key: key,
      event: function(data) {
        if (data) {
          $('td.inline-active').removeClass('inline-active');
          item.contentEditable = false;
          this.mainData[index][key] = item[key];
        } else {
          item[key] = this.mainData[index][key];
          this.headers = Object.assign([], this.mainHeader);
          item.contentEditable = false;
        }
      }.bind(this)
    });
  }
  onContentBlur(item) {
    $('td.inline-active').removeClass('inline-active');
    item.contentEditable = false;
  }
  setPropertyValues($event, item, key, model, schema, type, index) {
    if ($($event.target).prop('checked')) {
      item[key] = schema[0];
    } else {
      item[key] = schema[1];
    }
    const oldData = JSON.parse(JSON.stringify(this.mainData[index]));

    this.inlineUpdate.emit({
      value: item,
      selected: item[key],
      oldData: oldData,
      type: type,
      key: key,
      event: function(data) {
        if (data) {
          item.contentEditable = false;
        } else {
          item.contentEditable = false;
        }
      }.bind(this)
    });
    /*if ($($event.target).prop("checked")) {
      item[key] = schema[0];
    } else {
      item[key] = schema[1];
    }*/
    // item[key] = model ? schema[0] : schema[1];
  }
  getArray(str) {
    // console.log(str);
    return str && str.toString().split(',');
  }
  onInputBlur($event, item, schema, key, index, headerIndex, type) {
    item.contentEditable = false;
    const oldData = JSON.parse(JSON.stringify(this.mainData[index]));
    this.inlineUpdate.emit({
      value: item,
      selected: item[key],
      oldData: oldData,
      type: type,
      key: key,
      event: function(data) {
        if (data) {
          item.contentEditable = false;
        } else {
          item.contentEditable = false;
        }
      }.bind(this)
    });
  }
  checkAll() {
    const selectedRows = this.checkedFinalList.map(ele => {
      return ele.rnum || ele.RNUM;
    });
    if (this.selectAll) {
      this.pagination.data.forEach(element => {
        if (!element.disabled) {
          element.select = true;
        }
        if (
          ((element.rnum && selectedRows.indexOf(element.rnum) === -1) ||
            (element.RNUM && selectedRows.indexOf(element.RNUM) === -1)) &&
          !element.disabled
        ) {
          this.checkedFinalList.push(element);
        }
      });
    } else {
      this.pagination.data.forEach(element => {
        element.select = false;

        let ind: any = '';
        this.checkedFinalList.forEach((ele, index) => {
          if (
            (ele.rnum && ele.rnum === element.rnum) ||
            (ele.RNUM && ele.RNUM === element.RNUM)
          ) {
            ind = index;
          }
        });
        this.checkedFinalList.splice(ind, 1);
      });
    }
    console.log('selectedRows', selectedRows);
    this.innerValue = this.pagination.data.filter(function(data) {
      return data.select;
    });
    this.ngModel = this.innerValue;
    this.onChangeCallback(this.innerValue);
    this.recordSelected.emit(this.ngModel);
    this.selectedRecords.emit(this.checkedFinalList);
  }
  checkOne(one) {
    if (this.selectable.type !== 'radio') {
      console.log(one.select);
      if (one.select) {
        this.checkedFinalList.push(one);
      } else {
        let ind: any = '';
        this.checkedFinalList.forEach((ele, index) => {
          //   if (ele.rnum == one.rnum || ele.RNUM == one.RNUM) {
          if (
            (ele.rnum && ele.rnum === one.rnum) ||
            (ele.RNUM && ele.RNUM === one.RNUM)
          ) {
            ind = index;
          }
          if (
            (ele.selectListData && ele.selectListData === one.selectListData) ||
            (ele.selectListData && ele.selectListData === one.selectListData)
          ) {
            one.selectListData = [];
          }
        });
        this.checkedFinalList.splice(ind, 1);
      }
      console.log(this.checkedFinalList);
      if (!one.select) {
        this.selectAll = false;
      }
      this.innerValue = this.pagination.data.filter(function(data) {
        return data.select;
      });

      this.ngModel = this.innerValue;
      this.onChangeCallback(this.innerValue);
      this.recordSelected.emit(one);
      this.selectedRecords.emit(this.checkedFinalList);

      const checked =
        this.pagination.data
          .map(ele => {
            return ele.select === true;
          })
          .indexOf(false) === -1;
      this.selectAll = checked;
    } else {
      this.ngModel = [one];
      this.onChangeCallback([one]);
      this.recordSelected.emit([one]);
      this.selectedRecords.emit([one]);
    }
  }

  changeMulti($event) {
    console.log('$event', $event);
    this.mutliSelectRecord.emit($event);
  }

  selected($event) {
    console.log('selected $event', $event);
  }
  unCheckAll() {
    this.pagination.data.forEach(ele => {
      ele.select = false;
    });
    this.checkedFinalList = [];
  }

  loadPopover($event, item, key) {
    if (
      $event.clientX < window.innerWidth / 2 &&
      $event.clientY < window.innerHeight / 2
    ) {
      this.popoverPlacement = 'bottom-left';
    }
    if (
      $event.clientX < window.innerWidth / 2 &&
      $event.clientY > window.innerHeight / 2
    ) {
      this.popoverPlacement = 'top-left';
    }
    if (
      $event.clientX > window.innerWidth / 2 &&
      $event.clientY > window.innerHeight / 2
    ) {
      this.popoverPlacement = 'top-right';
    }
    if (
      $event.clientX > window.innerWidth / 2 &&
      $event.clientY < window.innerHeight / 2
    ) {
      this.popoverPlacement = 'bottom-right';
    }
    this.popoverContent = null;
    this.popoverData.emit({
      row: item,
      key: key,
      popoverText: $event.target.textContent.trim(),
      content: content => {
        this.popoverContent = content;
      },
      event: $event
    });
  }

  //get accessor
  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  onControl($event, name, item) {
    this.actions.emit({ event: $event, item: name, value: item });
  }
  staticClick($event) {
    this.staticAction.emit($event);
  }
  getNode(item, $event, header) {
    this.nodeAction.emit({ item: item, event: $event, header });
  }
  openPopup(link) {
    //window.open(link, 'MyWindow', "width=700,height=600")
    window.open(
      link,
      '0',
      'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,width=800,height=600'
    );
  }

  // export logic

  async generatePDF(flag) {
    const data = {
      startIndex: 0,
      endIndex: this.pagination.totalRecords,
      sortByColumn: this.sortByColumn ? this.sortByColumn : this.defaultColumn,
      sortDirection: this.sortDirection ? this.sortDirection : this.dir
    };

    const data1 = await this.componentService
      .getDataTableData(this.url, data, this.method, this.body)
      .toPromise();

    if (this.flatability) {
      console.log('flatabilty true');
      this.flatEmiter.emit({
        data: data1,
        generate: dataRes => {
          console.log(dataRes);

          this.exportDataPDF = Array.isArray(dataRes) ? dataRes : [dataRes];
        }
      });
    } else {
      this.exportDataPDF = Array.isArray(data1.response.rows)
        ? data1.response.rows
        : [data1.response.rows];
    }
    this.imgToBase64('/assets/images/logo.jpg', base64 => {
      console.log('base64 converted ');
      this.base64Img = base64;
      this.generate(flag);
    });
  }

  getColumns() {
    const headers = [];
    this.headers.filter(ele => {
      if (ele.checked && ele.label !== 'Options') {
        headers.push({ header: ele.label, dataKey: ele.key });
      }
    });
    return headers;
  }

  getReportColumns() {
    const headers = [];
    this.headers.filter(ele => {
      if (
        (ele.checked || ele.addReportColumn) &&
        ele.label !== 'Options' &&
        !ele.hideReportColumn
      ) {
        headers.push(ele.label);
      }
    });
    return [headers];
  }

  getColumnsWidth() {
    const columnStyles: any = {};
    let i = 0;
    this.headers.filter(ele => {
      if (
        (ele.checked || ele.addReportColumn) &&
        ele.label !== 'Options' &&
        !ele.hideReportColumn
      ) {
        if (ele.cellWidth) {
          columnStyles[i] = { cellWidth: ele.cellWidth };
        }
        ++i;
      }
    });
    // console.log('columnStyles:',columnStyles);
    return columnStyles;
  }

  getReportData() {
    const arr = [];
    this.exportDataPDF.forEach(ele => {
      const obj = [];
      this.headers.filter(ele1 => {
        if (
          (ele1.checked || ele1.addReportColumn) &&
          ele1.label !== 'Options' &&
          !ele1.hideReportColumn
        ) {
          obj.push(ele[ele1.key]);
        }
      });
      arr.push(obj);
    });
    return arr;
  }

  getData() {
    const arr = [];
    this.exportDataPDF.forEach(ele => {
      const obj = {};
      this.getColumns().forEach(ele1 => {
        obj[ele1.dataKey] = ele[ele1.dataKey];
      });
      arr.push(obj);
    });
    console.log(arr);

    return arr;
  }

  imgToBase64(url, callback) {
    if (!window['FileReader']) {
      callback(null);
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      const reader: any = new FileReader();
      reader.onloadend = function() {
        callback(reader.result.replace('text/xml', 'image/jpg'));
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  }

  generate(flag) {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    const title = this.exportTitle;
    const fileName = this.fileName;
    const pageContent = data => {
      // HEADER
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      if (this.base64Img) {
        doc.addImage(
          this.base64Img,
          'JPG',
          data.settings.margin.left,
          10,
          60,
          15,
          15,
          15
        );
      }
      console.log(this);
      doc.setFontStyle('bold');
      doc.text(title ? title : 'Title', data.settings.margin.left + 75, 20);

      if (this.reportFromDate && this.reportToDate) {
        doc.setFontStyle('bold');
        doc.setFontSize(7);
        doc.text(
          this.reportFromDate + ' to ' + this.reportToDate,
          data.settings.margin.left + 75,
          25
        );
      }
      // FOOTER
      let str = 'Page ' + data.pageCount;
      //Total page number plugin only available in jspdf v1.0+
      if (typeof doc.putTotalPages === 'function') {
        str = str + ' of ' + totalPagesExp;
      }
      doc.setFontStyle('normal');
      doc.setFontSize(7);
      const footerText = `This document is the property of BookPurohit.Written permission of BookPurohit. `;
      const footerText1 = ``;
      const date = moment().format('DD-MMM-YYYY hh:mm A');
      doc.text(
        footerText,
        data.settings.margin.left,
        doc.internal.pageSize.height - 15
      );
      doc.text(
        footerText1,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        date,
        data.settings.margin.left,
        doc.internal.pageSize.height - 5
      );
      doc.text(
        str,
        data.settings.margin.left + 185,
        doc.internal.pageSize.height - 5
      );
      //doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      // console.log(data.settings);
      // doc.text(moment().format('DD-MMM-YYYY hh:mm A'), data.settings.margin.right, doc.internal.pageSize.height - 10);
    };

    const headerFontSize = this.reportFontSize ? this.reportFontSize : 7;
    const bodyFontSize = this.reportFontSize ? this.reportFontSize : 8;
    const reportHeaderOverflow = this.reportHeaderOverflow
      ? this.reportHeaderOverflow
      : 'visible';
    const reportBodyOverflow = this.reportBodyOverflow
      ? this.reportBodyOverflow
      : 'linebreak';
    const reportCellAlign = this.reportCellAlign
      ? this.reportCellAlign
      : 'center';

    doc.autoTable({
      head: this.getReportColumns(),
      body: this.getReportData(),
      styles: { overflow: 'linebreak' },
      // padding: {right: 0, left: 2},
      didDrawPage: pageContent,
      margin: {
        top: 30,
        left: 5,
        right: 5,
        bottom: 25
      },
      headStyles: {
        fontSize: headerFontSize,
        halign: reportCellAlign,
        overflow: reportHeaderOverflow
      },
      bodyStyles: {
        fontSize: bodyFontSize,
        halign: reportCellAlign,
        overflow: reportBodyOverflow
      },
      columnStyles: this.getColumnsWidth(),
      tableWidth: 'auto'
    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    if (flag === 'print') {
      doc.output('dataurlnewwindow');
    } else {
      doc.save(fileName ? fileName : 'Sample' + '.pdf');
    }
  }

  async exportAsXLSX() {
    const data = {
      startIndex: 0,
      endIndex: this.pagination.totalRecords,
      sortByColumn: this.sortByColumn ? this.sortByColumn : this.defaultColumn,
      sortDirection: this.sortDirection ? this.sortDirection : this.dir
    };

    const data1 = await this.componentService
      .getDataTableData(this.url, data, this.method, this.body)
      .toPromise();
    this.exportDataExcel = Array.isArray(data1.response.rows)
      ? data1.response.rows
      : [data1.response.rows];

    this.excelService.exportAsExcelFile(this.excelData(), this.fileName);
  }

  excelData() {
    const arr = [];
    this.exportDataExcel.forEach(ele => {
      const obj = {};
      this.getColumns().forEach(ele1 => {
        obj[ele1.header] = ele[ele1.dataKey];
      });
      arr.push(obj);
    });

    return arr;
  }
  makeNormal($event, item) {
    if (!$($event.target).closest('.inline-active')[0]) {
      item.contentEditable = false;
      this.editableRowNum = -1;
      $('td.inline-active').removeClass('inline-active');
    }
  }
}