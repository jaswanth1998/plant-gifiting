import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TreeService } from 'src/app/pages/tree/tree.service';
import { EventService } from '../../pages/events/event-service.service';
import { ApiServiceService } from './api-service.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-common-drawer',
  templateUrl: './common-drawer.component.html',
  styleUrls: ['./common-drawer.component.scss'],
})
export class CommonDrawerComponent implements OnInit {
  @Input() value: any;
  @Input() button = '';
  @Input() category = '';
  @Input() isNew = true;
  public Editor = ClassicEditor;

  confirmModal?: NzModalRef;

  TreeForm: FormGroup;
  NGOForm: FormGroup;
  EvetForm: FormGroup;
  EcardForm: FormGroup;
  OrdersForm: FormGroup;
  QueriesForm: FormGroup;
  locationForm: FormGroup;

  isLive = false;
  oneImageUploadFlag = false;
  multipleImageUploadFlag = false;
  EventsList: any;
  TreesList: any;
  LocationsList: any;
  selectedEvent = '';

  uploadedImage = null;
  multipleUploadImages = [];

  NGO_projects: any[] = [];
  uploadedDoc: any;
  isLocLive: boolean;
  isPrjLive: boolean;
  newMsg: string;

  // orderStatus = [
  //   {
  //     lable  : "open",
  //     value : "open"
  //   },
  //   {
  //     lable  : "In progress",
  //     value : "In progress"
  //   },
  //   {
  //     lable  : "Planted",
  //     value : "Planted"
  //   },
  //   {
  //     lable  : "Project concluded",
  //     value : "Project concluded"
  //   }

  // ];

  addNGOPrj() {
    let prj = {
      projectName: '',
      ProjectLocationandTrees: [],
    };

    this.NGO_projects.push(prj);
  }

  addNGOloc(prjindex) {
    this.NGO_projects[prjindex]['ProjectLocationandTrees'].push({
      projectLocationID: '',
      trees: [],
    });
  }

  addNGOloctree(prjindex, locindex) {
    this.NGO_projects[prjindex]['ProjectLocationandTrees'][locindex].trees.push(
      {
        treeName: '',
        invenoory: 0,
        cost: 0,
        min: 0,
        max: 0,
        treeId: '',
      }
    );
  }

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private EventService: EventService,
    private TreeService: TreeService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private apiService: ApiServiceService
  ) { }

  get secondaryTag() {
    return this.TreeForm.controls['secondaryTag'] as FormArray;
  }

  addsecondaryTag(data = '') {
    const form = new FormGroup({
      tag: new FormControl(data, [Validators.required]),
    });

    this.secondaryTag.push(form);
  }

  deletesecondaryTag(tagIndex: number) {
    this.secondaryTag.removeAt(tagIndex);
  }

  async ngOnInit(): Promise<void> {
    console.log(this.value, this.category, this.button);

    if (this.category === 'tree') {
      this.uploadedImage = this.value.icon ? this.value.icon : null;
      this.multipleUploadImages = this.value.images ? this.value.images : [];
      this.TreeForm = new FormGroup({
        treeName: new FormControl(this.value.treeName, [Validators.required]),
        primaryTag: new FormControl(this.value.primaryTag, [
          Validators.required,
        ]),
        secondaryTag: this.fb.array([]),
        //  new FormControl(this.value.secondaryTag, []),
        icon: new FormControl(null, [
          // Validators.required,
        ]),
        price: new FormControl(this.value.price, []),
        images: new FormControl(null, [
          // Validators.required,
        ]),
        treeIntroduction: new FormControl(this.value.treeIntroduction, [
          Validators.required,
        ]),
      });

      if (!this.isNew) {
        if (
          this.value.isLive.toLowerCase() === 'false' ||
          this.value.isLive.toLowerCase() === 'no'
        ) {
          this.isLive = false;
        } else if (
          this.value.isLive.toLowerCase() === 'true' ||
          this.value.isLive.toLowerCase() === 'yes'
        ) {
          this.isLive = true;
        } else {
          this.isLive = false;
        }

        // addsecondaryTag

        this.value.secondaryTag.forEach((element) => {
          console.log(element);
          this.addsecondaryTag(element);
        });
      }
    }

    if (this.category === 'NGO') {
      if (this.isNew === true) {
        this.NGOForm = new FormGroup({
          ngoName: new FormControl(null, [Validators.required]),
          description: new FormControl(null, [Validators.required]),
          address: new FormControl(null, [Validators.required]),
          spocName: new FormControl(null, [Validators.required]),
          email: new FormControl(null, [Validators.required, Validators.email]),
          phoneNumber: new FormControl(this.value.phoneNumber, [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ]),
        });
      } else {
        this.NGOForm = new FormGroup({
          ngoName: new FormControl(this.value.ngoName, [Validators.required]),
          description: new FormControl(this.value.description, [
            Validators.required,
          ]),
          address: new FormControl(this.value.address, [Validators.required]),
          spocName: new FormControl(this.value.spocName, [Validators.required]),
          email: new FormControl(this.value.email, [
            Validators.required,
            Validators.email,
          ]),
          phoneNumber: new FormControl(this.value.phoneNumber, [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ]),
        });

        (await this.TreeService.getTreeList()).subscribe(
          (response: any) => {
            console.log(response);
            this.TreesList = response.data.filter((item) => {
              if (
                item.isLive.toLowerCase() === 'yes' ||
                item.isLive.toLowerCase() === 'true'
              ) {
                return item;
              }
            });
            console.log(this.TreesList);
          },
          (error) => {
            console.log(error);
            // this.commonService.showProcessingToastOff();
          }
        );

        (await this.TreeService.getlocatjionsList()).subscribe(
          (response: any) => {
            console.log(response);
            this.LocationsList = response.data;
            console.log(this.LocationsList);
          },
          (error) => {
            console.log(error);
            // this.commonService.showProcessingToastOff();
          }
        );

        this.NGO_projects = this.value.projectDetails;
      }

      if (this.value.isLive === 'false') {
        this.isLive = false;
      } else if (this.value.isLive === 'true') {
        this.isLive = true;
      } else {
        this.isLive = false;
      }
    }

    if (this.category === 'event') {
      this.EvetForm = new FormGroup({
        eventName: new FormControl(this.value.eventName, [Validators.required]),
        eventImage: new FormControl(null, [
          //
        ]),
      });
      this.uploadedImage = this.value.eventImage ? this.value.eventImage : null;

      if (this.isNew === true) {
        this.isLive = false;
      } else {
        if (this.value.isLive.toLowerCase() === 'no') {
          this.isLive = false;
        } else if (this.value.isLive.toLowerCase() === 'yes') {
          this.isLive = true;
        } else {
          this.isLive = false;
        }
      }
    }

    if (this.category === 'ecard') {
      if (this.isNew === true) {
        this.isLive = false;
        this.EcardForm = new FormGroup({
          ecardName: new FormControl(this.value.ecardName, [
            Validators.required,
          ]),
          // html: new FormControl(this.value.html, [Validators.required]),
        });
      } else {
        console.log(this.value);
        this.EcardForm = new FormGroup({
          ecardName: new FormControl(this.value.ecardName, [
            Validators.required,
          ]),
          openFor: new FormControl(this.value.openFor, [Validators.required]),
        });
        //  html: new FormControl(this.value.html, [Validators.required]),

        this.uploadedImage = this.value.html;

        if (this.value.isLive.toLowerCase() === 'no') {
          this.isLive = false;
        } else if (this.value.isLive.toLowerCase() === 'yes') {
          this.isLive = true;
        } else {
          this.isLive = false;
        }

        (await this.EventService.getEventList()).subscribe(
          (response: any) => {
            console.log(response);
            this.EventsList = response.data.filter((item) => {
              if (item.isLive.toLowerCase() === 'yes') {
                return item;
              }
            });
          },
          (error) => {
            console.log(error);
            // this.commonService.showProcessingToastOff();
          }
        );
      }
    }
    if (this.category === 'location') {
      if (this.isNew === true) {
        this.isLive = false;
        this.locationForm = new FormGroup({
          locationName: new FormControl(this.value.locationName, [
            Validators.required,
          ]),
          pincode: new FormControl(this.value.pincode, [
            Validators.required,
          ]),
        });
      } else {
        console.log(this.value);
        this.locationForm = new FormGroup({
          locationName: new FormControl(this.value.locationName, [
            Validators.required,
          ]),
          pincode: new FormControl(this.value.pincode, [
            Validators.required,
          ]),
        });
        //  html: new FormControl(this.value.html, [Validators.required]),

        if (this.value.isLive.toLowerCase() === 'no') {
          this.isLive = false;
        } else if (this.value.isLive.toLowerCase() === 'yes') {
          this.isLive = true;
        } else {
          this.isLive = false;
        }

      }
    }

    if (this.category === 'orders') {
      if (this.isNew === true) {
        // this.isLive = false;
        // this.EcardForm = new FormGroup({
        //   ecardName: new FormControl(this.value.ecardName, [
        //     Validators.required,
        //   ]),
        //   html: new FormControl(this.value.html, [
        //     Validators.required,
        //   ])
        // });
      } else {
        console.log(this.value);
        this.multipleUploadImages = this.value.orderPhotos;
        this.uploadedDoc = this.value.report;
        this.OrdersForm = new FormGroup({
          status: new FormControl(this.value.status, [Validators.required]),
        });
      }
    }

    if (this.category === 'queries') {
      if (this.isNew === true) {
        // this.isLive = false;
        // this.EcardForm = new FormGroup({
        //   ecardName: new FormControl(this.value.ecardName, [
        //     Validators.required,
        //   ]),
        //   html: new FormControl(this.value.html, [
        //     Validators.required,
        //   ])
        // });
      } else {
        console.log(this.value);
        this.QueriesForm = new FormGroup({
          status: new FormControl(this.value.status, [Validators.required]),
        });
      }
    }

    // Projects

    if (this.category === 'projects') {
      if (this.isNew === true) {
        // this.isLive = false;
        // this.EcardForm = new FormGroup({
        //   ecardName: new FormControl(this.value.ecardName, [
        //     Validators.required,
        //   ]),
        //   html: new FormControl(this.value.html, [
        //     Validators.required,
        //   ])
        // });
      } else {
        console.log(this.value);

        if (this.value.projectDetails.live) {
          if (this.value.projectDetails.live.toLowerCase() === 'no') {
            this.isPrjLive = false;
          } else if (this.value.projectDetails.live.toLowerCase() === 'yes') {
            this.isPrjLive = true;
          }
        } else {
          this.isPrjLive = false;
        }

        console.log(this.value.projectDetails.ProjectLocationandTrees.live);

        if (this.value.projectDetails.ProjectLocationandTrees.live) {
          if (
            this.value.projectDetails.ProjectLocationandTrees.live.toLowerCase() ===
            'no'
          )
            this.isLocLive = false;
          else if (
            this.value.projectDetails.ProjectLocationandTrees.live.toLowerCase() ===
            'yes'
          ) {
            this.isLocLive = true;
          }
        } else {
          this.isLocLive = false;
        }
      }
    }
  }

  close(): void {
    this.drawerRef.close({});
  }
  treeSubmit() {
    if (this.TreeForm.valid) {
      if (!this.uploadedImage) {
        alert('Upload Tree image to proceed');
      } else {
        let formData = this.TreeForm.value;
        formData['isLive'] = this.isLive;
        formData['icon'] = this.uploadedImage;
        formData['images'] = this.multipleUploadImages;
        let tags = [];

        formData['secondaryTag'].map((stag) => {
          tags.push(stag.tag);
        });
        formData['secondaryTag'] = tags;

        if (this.value || !this.isNew) {
          formData['_id'] = this.value['_id'];
        }
        console.log(formData);
        this.drawerRef.close(formData);
      }
    } else {
      alert('invalid data not able to proceed');
    }
  }

  NGOSubmit() {
    if (this.NGOForm.valid) {
      console.log(this.NGOForm.value);
      let formData = this.NGOForm.value;
      if (this.value) {
        formData['_id'] = this.value['_id'];
      }
      formData.projectDetails = this.NGO_projects;

      console.log(JSON.stringify(formData));

      this.drawerRef.close(formData);
    } else {
      alert('invalid data not able to proceed');
    }
  }

  eventSubmit() {
    if (this.EvetForm.valid) {
      if (!this.uploadedImage) {
        alert('Upload event image to proceed');
      } else {
        console.log(this.EvetForm.value);
        let formData = this.EvetForm.value;

        if (this.isLive === true) {
          formData['isLive'] = 'yes';
        }
        if (this.isLive === false) {
          formData['isLive'] = 'no';
        }
        // need to update
        formData['eventImage'] = this.uploadedImage;

        if (this.value) {
          formData['_id'] = this.value['_id'];
        }
        this.drawerRef.close(formData);
      }
    } else {
      alert('invalid data not able to proceed');
    }
  }

  ecardSubmit() {
    if (this.EcardForm.valid) {
      console.log(this.EcardForm.value);
      let formData = this.EcardForm.value;

      if (this.isLive === true) {
        formData['isLive'] = 'yes';
      }
      if (this.isLive === false) {
        formData['isLive'] = 'no';
      }

      if (this.value) {
        formData['_id'] = this.value['_id'];
        formData['html'] = this.uploadedImage;
      }
      this.drawerRef.close(formData);
    } else {
      alert('invalid data not able to proceed');
    }
  }

  submitVendPrj() {
    let prj = '';
    let loc = '';
    if (this.isPrjLive === true) {
      prj = 'Yes';
    } else {
      prj = 'No';
    }

    if (this.isLocLive === true) {
      loc = 'Yes';
    } else {
      loc = 'No';
    }

    let data = {
      projectId: this.value.projectDetails._id,
      locationID: this.value.projectDetails.ProjectLocationandTrees._id,
      PrjLive: prj,
      locLive: loc,
      report: this.uploadedDoc || this.value.projectDetails.report,
    };

    this.drawerRef.close(data);
  }

  onImagesSelected(event: any) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    let filename = 'TreeImage' + '_' + moment() + '.png';
    formData.append('fileName', 'tree/' + filename);
    this.oneImageUploadFlag = true;
    this.apiService.uploadPic(formData).subscribe((data) => {
      console.log(data);
      this.multipleUploadImages.push(data.data.url);
    });
    console.log(this.multipleUploadImages);
    // alert()
  }

  onImagesSelectedOrder(event: any) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    let filename =
      'orderImage' + this.value.senderPhoneNumber + '_' + moment() + '.png';
    formData.append('fileName', 'orders/' + filename);
    this.oneImageUploadFlag = true;
    this.apiService.uploadPic(formData).subscribe((data) => {
      console.log(data);
      this.multipleUploadImages.push(data.data.url);
    });
    console.log(this.multipleUploadImages);
    // alert()
  }

  uploadmultipleImages() { }

  onOneImageSelected(event: any) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    let filename = 'trees' + moment() + '.png';
    formData.append('fileName', 'tress/' + filename);
    this.oneImageUploadFlag = true;
    this.apiService.uploadPic(formData).subscribe((data) => {
      this.uploadedImage = data.data.url;
      console.log(data);
    });
  }

  onOneImageSelectedEcard(event: any) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    let filename = 'Ecard' + moment() + '.png';
    formData.append('fileName', 'ecard/' + filename);
    this.oneImageUploadFlag = true;
    this.apiService.uploadPic(formData).subscribe((data) => {
      this.uploadedImage = data.data.url;
      console.log(data);
    });
  }

  onOneFileSelected(event: any) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    let filename =
      this.value.projectDetails.projectName +
      '-' +
      this.value.locationDetails.locationName +
      'Report ' +
      moment() +
      '.pdf';
    formData.append('fileName', 'tress/' + filename);
    this.oneImageUploadFlag = true;
    this.apiService.uploadPDF(formData).subscribe((data) => {
      this.uploadedDoc = data.data.url;
      console.log(data);
    });
  }

  onOneFileSelectedForOrder(event: any) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    let filename =
      this.value.senderPhoneNumber + '-' + ' OrderReport ' + moment() + '.pdf';
    formData.append('fileName', 'orderReports/' + filename);
    this.oneImageUploadFlag = true;
    this.apiService.uploadPDF(formData).subscribe((data) => {
      this.uploadedDoc = data.data.url;
      console.log(data);
    });
  }

  showreqError(form, field) {
    const formfield = form.get(field);
    if (formfield.touched && !formfield.valid) {
      if (formfield.errors.required) {
        return 'Field is required';
      }
      if (formfield.errors.email) {
        return 'Invalid Emai';
      }
    }
  }

  showreqandemilError(form, field) {
    const formfield = form.get(field);
    if (formfield.touched && !formfield.valid) {
      if (formfield.errors.required) {
        return 'Field is required';
      }
      if (formfield.errors.email) {
        return 'Invalid Emai';
      }
      // regex
    }
  }

  showreqerrandPhoneerror(form, field) {
    const formfield = form.get(field);
    if (formfield.touched && !formfield.valid) {
      if (formfield.errors.required) {
        return 'Field is required';
      }
      if (formfield.error.pattern) {
        return 'Invalid ' + field + 'field';
      }
      // regex
    }
  }

  deleteNGOloctree(prjindex, locindex, treeindex) {
    console.log(prjindex, locindex, treeindex);
    console.log(this.NGO_projects);
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete tree ',
      nzOnOk: () => {
        console.log('delete the tree ');
        this.NGO_projects[prjindex]['ProjectLocationandTrees'][locindex][
          'trees'
        ].splice(treeindex, 1);
      },
    });
  }
  deleteNGOlocation(prjindex, locindex) {
    console.log(prjindex, locindex);
    console.log(this.NGO_projects);

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete Location ',
      nzOnOk: () => {
        console.log('delete the location ');
        this.NGO_projects[prjindex]['ProjectLocationandTrees'].splice(
          locindex,
          1
        );
      },
    });
  }
  deleteNGOprj(prjindex) {
    console.log(prjindex);
    console.log(this.NGO_projects);

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete Project ',
      nzOnOk: () => {
        console.log('delete the location ');
        this.NGO_projects.splice(prjindex, 1);
      },
    });
  }

  orderEditSubmit() {
    if (this.OrdersForm.valid) {
      console.log(this.OrdersForm.value);
      let formData = this.OrdersForm.value;
      if (this.value) {
        formData['_id'] = this.value['_id'];
        formData['orderPhotos'] = this.multipleUploadImages;
        formData['report'] = this.uploadedDoc;
      }
      this.drawerRef.close(formData);
    } else {
      alert('invalid data not able to proceed');
    }
  }

  queriesEditSubmit() {
    if (this.QueriesForm.valid) {
      console.log(this.QueriesForm.value);
      let formData = this.QueriesForm.value;
      if (this.value) {
        formData['_id'] = this.value['_id'];
      }
      this.drawerRef.close(formData);
    } else {
      alert('invalid data not able to proceed');
    }
  }

  locationSubmit() {
    if (this.locationForm.valid) {
      console.log(this.locationForm.value);
      let formData = this.locationForm.value;
      if (this.value) {
        formData['_id'] = this.value['_id'];
      }
      this.drawerRef.close(formData);
    } else {
      alert('invalid data not able to proceed');
    }
  }

  deleteimageindex(index) {
    this.multipleUploadImages.splice(index, 1);
  }
  deleteLogo() {
    this.uploadedImage = null;
  }

  deleteDoc() {
    this.uploadedDoc = null;
  }

  sendNewChat() {
    console.log(this.newMsg, this.value._id);

    console.log(this.value);

    this.value.chats.push({
      type: 'admin',
      reply: this.newMsg,
      date: moment().toString(),
    });

    

    this.apiService
      .sendQueriesNewMsg(this.value._id, this.value)
      .subscribe(async (data) => {
        console.log(this.value);

        const emailMsg = `Dear  User, <br>
        We have received your Query and please find our response as below- <br>
        Query- ${this.value.query} <br>
        Response- ${this.newMsg}`;
        const emailObj = {
          "to": this.value['email'],
          "subject": "Update on query",
          "text": emailMsg,
          "html": emailMsg
        }
        this.newMsg = '';

        await (await this.apiService.sendEmail(emailObj)).toPromise()
      });
  }
}
