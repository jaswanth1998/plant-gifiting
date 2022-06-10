import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../service/api.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class DatatableService extends ApiService {
  getDataTableData(url, data, method, body) {
    if (method === 'POST') {
      return this.post(
        (url.indexOf('?') !== -1 ? url + '&' : url + '?') +
          'startIndex=' +
          data.startIndex +
          '&endIndex=' +
          data.endIndex +
          '&sortColumn=' +
          data.sortByColumn +
          '&dir=' +
          data.sortDirection,
        body
      );
    }
    return this.get(
      (url.indexOf('?') !== -1 ? url + '&' : url + '?') +
        'startIndex=' +
        data.startIndex +
        '&endIndex=' +
        data.endIndex +
        '&sortColumn=' +
        data.sortByColumn +
        '&dir=' +
        data.sortDirection
    );
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
