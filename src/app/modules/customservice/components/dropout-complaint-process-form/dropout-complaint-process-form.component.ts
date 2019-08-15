import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { rangePickerTodayDisabledDate } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { changeJson } from '../../../../tools';
import { NzCascaderComponent } from 'ng-zorro-antd';
import { DropoutComplaintProcessFormService } from '../../service/dropout-complaint-process-form.service';
import { CommonrearformService } from 'src/app/modules/rear-end/service/commonrearform.service';

@Component({
  selector: 'app-dropout-complaint-process-form',
  templateUrl: './dropout-complaint-process-form.component.html',
  styleUrls: ['./dropout-complaint-process-form.component.scss']
})
export class DropoutComplaintProcessFormComponent implements OnInit, OnDestroy, DoCheck {
  @Output() sendQueryData = new EventEmitter();
  @Input() isShowDutyState: Boolean = true;
  @Input() isShowRangePicker: Boolean = true;
  @ViewChild('deptNameCascader', { static: false }) deptNameCascader: NzCascaderComponent;
  public loading: Boolean = false;
  public rangePickerDisabledDate: Function = rangePickerTodayDisabledDate;
  public subscribeAll$: Object = {};
  public deptNameOptions: Array<Object> = [];  // 部门学院下拉列表
  public paramsAll: object = { roleName: '班主任' };
  public validateForm: FormGroup;

  constructor(private fb: FormBuilder, public dropoutComplaintProcessFormService: DropoutComplaintProcessFormService,
    private commonCustomService: CommonCustomService, public commonrearformService: CommonrearformService) { }

  ngDoCheck() {
    if (this.loading !== this.dropoutComplaintProcessFormService.loading) {
      this.loading = this.dropoutComplaintProcessFormService.loading;
    }
  }

  deptNameChange(deptName) {
    this.validateForm.get('userId').patchValue([]);
    if (deptName && deptName.length) {
      const parentId = deptName[deptName.length - 1];
      this.paramsAll['parentId'] = parentId;
    } else {
      delete this.paramsAll['parentId'];
    }
  }
  /**
   * 获取班主任 学院
   */
  getTreeSxDept() {
    this.subscribeAll$['getTreeSxDept$'] = this.dropoutComplaintProcessFormService.getTreeSxDept().subscribe(res => {
      this.deptNameOptions = changeJson(res.data);
    });
  }



  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    if (!this.isShowDutyState || this.validateForm.value['state'] === '全部') {
      delete this.validateForm.value['state'];
    }
    if (!this.isShowRangePicker) {
      delete this.validateForm.value['rangePicker'];
    }
    const deptName = this.validateForm.value.deptName;
    const params = Object.assign({}, this.validateForm.value);
    if (params.deptName && params.deptName.length) {
      params.deptName = deptName[deptName.length - 1];
      params.deptNameLabel = this.deptNameCascader.labelRenderText;
    }
    this.sendQueryData.emit(params);
  }


  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset(this.dropoutComplaintProcessFormService.defalutData);
  }


  ngOnInit(): void {
    this.initForm();
    this.getTreeSxDept();
  }

  initForm() {
    const { deptName, state, rangePicker, userId } = this.dropoutComplaintProcessFormService.defalutData;
    this.validateForm = this.fb.group({
      deptName: [deptName],  // 部门 学院
      userId: [userId],  // 班主任
      state: [state],   // 在岗状态
      rangePicker: [rangePicker]  // 日期范围
    });
  }


  ngOnDestroy() {
    this.loading = this.dropoutComplaintProcessFormService.loading = false;
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
