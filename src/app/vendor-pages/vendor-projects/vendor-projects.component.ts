import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { observable } from 'rxjs';
import { CommonDrawerComponent } from 'src/app/common/common-drawer/common-drawer.component';
import { CommonnViewDrawerComponent } from 'src/app/common/commonn-view-drawer/commonn-view-drawer.component';
import { CommonService } from 'src/app/services/common.service';
import { VendorProjectsService } from './vendor-projects.service';

@Component({
  selector: 'app-vendor-projects',
  templateUrl: './vendor-projects.component.html',
  styleUrls: ['./vendor-projects.component.scss'],
})
export class VendorProjectsComponent implements OnInit {
  confirmModal?: NzModalRef;
  public HeaderButtons: any[] = [];
  public FullDataTable: any[] = [];
  public tableHeaders: any[] = [
    {
      label: 'Project Name',
      key: 'projectName',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Location',
      key: 'projectLocations',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Project Status',
      key: 'live',
      checked: true,
      sortable: true,
      sortDir: 'desc',
      filter: true,
    },
    {
      label: 'Report Status',
      key: 'report',
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
      controls: [{ label: 'View' }, { label: 'Edit' }],
    },
  ];
  public tableData = undefined;
  public dataTablePage = 1;
  dataTable = false;
  isUpdate = false;
  constructor(
    private drawerService: NzDrawerService,
    private ProjectsService: VendorProjectsService,
    private modal: NzModalService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getProjectsTableData();
  }

  openNeworEditProjectsDrawer(
    data = {},
    title = 'Add Projects',
    button = 'Add Projects',
    isNew = true
  ) {
    console.log(title, button, isNew);
    const editdrawerRef = this.drawerService.create<
      CommonDrawerComponent,
      { value: Object; button: string; category: string; isNew: boolean },
      Object
    >({
      nzTitle: title,
      // nzFooter: 'Footer',
      nzWidth: '1000px',
      nzContent: CommonDrawerComponent,
      nzContentParams: {
        value: data,
        category: 'projects',
        button: button,
        isNew: isNew,
      },
    });

    editdrawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    editdrawerRef.afterClose.subscribe((data: any) => {
      console.log(data);
      if (typeof data === 'object') {
        // this.responseData = data;
        console.log(data);

        if (this.isUpdate) {
          this.commonService.showProcessingToastOn();
          this.ProjectsService.updatevendorPrj(
            data.projectId,
            data.PrjLive
          ).subscribe(
            (response: any) => {
              console.log(response);
              // this.commonService.showProcessingToastOff();
              this.commonService.successToast('Project status updated..!');

              // location api inside success of above

              this.ProjectsService.updateVendPrjLive(
                data.projectId,
                data.locationID,
                data.PrjLive == 'Yes' ? data.locLive : 'No'
              ).subscribe(
                (response: any) => {
                  console.log(response);
                  this.commonService.successToast('Location status updated..!');

                  //  reports API  inside success of above

                  this.ProjectsService.addVendorPrjReport(
                    data.projectId,
                    data.report
                  ).subscribe(
                    (response: any) => {
                      console.log(response);
                      this.commonService.showProcessingToastOff();

                      setTimeout(() => {
                        this.getProjectsTableData();
                      }, 1000);
                    },
                    (error) => {
                      console.log(error);
                      this.commonService.showProcessingToastOff();
                      this.commonService.errorToast(error.message);
                    }
                  );

                  //  reports API
                },
                (error) => {
                  console.log(error);
                  this.commonService.errorToast(error.message);
                }
              );

              //  location api
            },
            (error) => {
              console.log(error);
              this.commonService.showProcessingToastOff();
              this.commonService.errorToast(error.message);
            }
          );
        }
        // else {
        //   // this.commonService.showProcessingToastOn();
        //   this.ProjectsService.addNewProjects(data).subscribe(
        //     (response: any) => {
        //       console.log(response);
        //       // this.commonService.showProcessingToastOff();
        //       this.commonService.successToast('Projects added successfully');
        //       setTimeout(() => {
        //         this.getProjectsTableData();
        //       }, 1000);
        //     },
        //     (error) => {
        //       console.log(error);
        //       // this.commonService.showProcessingToastOff();
        //       this.commonService.errorToast(error.message);
        //     }
        //   );
        // }
      }
    });
  }

  openViewProjectsDrawer(ProjectsObj) {
    const viewdrawerRef = this.drawerService.create<
      CommonnViewDrawerComponent,
      { value: Object; title: string; category: string },
      string
    >({
      nzTitle: 'Projects view',
      // nzFooter: 'Footer',
      nzWidth: '1000px',
      nzContent: CommonnViewDrawerComponent,
      nzContentParams: {
        value: ProjectsObj,
        title: 'Projects',
        category: 'Projects-view',
      },
    });

    viewdrawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    viewdrawerRef.afterClose.subscribe((data) => {
      console.log(data);
      if (typeof data === 'string') {
        // this.responseData = data;
      }
    });
  }

  async dataTableActions(Projects) {
    console.log(Projects.label);
    console.log(Projects);

    if (Projects.label === 'View') {
      console.log(this.FullDataTable[Projects.data.index]);
      this.openViewProjectsDrawer(this.FullDataTable[Projects.data.index]);
    } else if (Projects.label === 'Edit') {
      this.isUpdate = true;
      this.openNeworEditProjectsDrawer(
        this.FullDataTable[Projects.data.index],
        'Update Projects',
        'Update Projects',
        false
      );
    } else if (Projects.label === 'Delete') {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you Want to delete ' + Projects.data.ProjectsName,
        nzOnOk: () => {
          console.log('delete record ');
          // this.deleteProjects(Projects.data._id);
        },
      });
    }
  }

  // async deleteProjects(id) {
  //   this.commonService.showProcessingToastOn();
  //   (await this.ProjectsService.deleteProjects(id)).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       this.commonService.showProcessingToastOff();
  //       this.commonService.successToast('Projects deleted successfully');
  //       setTimeout(() => {
  //         this.getProjectsTableData();
  //       }, 1000);
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.commonService.showProcessingToastOff();
  //       this.commonService.errorToast(error.message);
  //     }
  //   );
  // }

  dataTableHeaderActions(Projects) {
    console.log(Projects);
    if (Projects.label === 'Add') {
      this.isUpdate = false;
      this.openNeworEditProjectsDrawer();
    }
  }

  async getProjectsTableData() {
    this.commonService.showProcessingToastOn();

    (await this.ProjectsService.getProjectsList()).subscribe(
      (response: any) => {
        console.log(response);
        this.FullDataTable = response.data;
        this.tableData = [];

        response.data.forEach((value, index) => {
          // console.log(value.projectDetails);
          let obj = {
            projectName: '',
            projectLocations: '',
            live: '',
            index: 0,
            report: '',
          };
          obj.projectName = value.projectDetails.projectName;
          obj.projectLocations = value.locationDetails.locationName;
          obj.live = value.projectDetails.live;

          obj.report = value.projectDetails.report ? 'Available' : '--';

          obj.index = index;
          this.tableData.push(obj);
        });

        this.commonService.showProcessingToastOff();

        this.refreshDatatable();
      },
      (error) => {
        console.log(error);
        // this.commonService.showProcessingToastOff();
        this.commonService.errorToast(error.message);
      }
    );
  }

  refreshDatatable() {
    this.dataTable = false;
    setTimeout(() => {
      this.dataTable = true;
    }, 100);
  }
}
