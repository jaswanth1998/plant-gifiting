import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class VendorProjectsService extends ApiService {
  async getProjectsList() {
    return this.get('ngo/vendorProjects', {});
  }

  public getProjectsListByID(id) {
    return this.get('Projectss/getProjectsDataById' + id, {});
  }

  public addNewProjects(body) {
    return this.post('Projectss/addProjectsDetails', body);
  }

  public updateProjects(id, body) {
    return this.post('Projectss/updateProjectsData/' + id, body);
  }

  public deleteProjects(objId) {
    console.log(objId);
    return this.get('Projectss/deleteProjectsDataByID/' + objId, {});
  }

  // ----

  public updatevendorPrj(prjid, status) {
    return this.post('ngo/updateVendorProject', {
      projectId: prjid,
      status: status,
    });
  }

  public updateVendPrjLive(prjId, locid, status) {
    return this.post('ngo/updateVendorProjectLocationLive', {
      projectId: prjId,
      projectLocationId: locid,
      status: status,
    });
  }

  public updateVendorPrjCompleteStatus(prjId,status){
    return this.post('ngo/updateVendorProjectCompleteStatus', {
      projectId: prjId,
      isCompleted: status,
    });
  }

  public addVendorPrjReport(prjid, url) {
    return this.post('ngo/updateVendorProjectReport', {
      projectId: prjid,
      report: url,
    });
  }
}
