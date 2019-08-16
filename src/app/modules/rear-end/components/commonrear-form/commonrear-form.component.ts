import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonrearformService } from '../../service/commonrearform.service';
import { rangePickerTodayDisabledDate } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { changeJson } from '../../../../tools';
import { NzCascaderComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-commonrear-form',
  templateUrl: './commonrear-form.component.html',
  styleUrls: ['./commonrear-form.component.scss']
})
export class CommonrearFormComponent implements OnInit, OnDestroy, DoCheck {
  @Output() sendQueryData = new EventEmitter();
  @Input() isShowDutyState = true;
  @Input() isShowRangePicker = true;
  @ViewChild('deptNameCascader', { static: false }) deptNameCascader: NzCascaderComponent;
  public loading = false;
  public rangePickerDisabledDate: (current: Date) => void = rangePickerTodayDisabledDate;
  public subscribeAll$: object = {};
  public deptNameOptions: Array<object> = [];  // 部门学院下拉列表
  public paramsAll: object = { roleName: '班主任' };
  public validateForm: FormGroup;

  constructor(private fb: FormBuilder, public commonrearformService: CommonrearformService,
    private commonCustomService: CommonCustomService) { }

  ngDoCheck() {
    if (this.loading !== this.commonrearformService.loading) {
      this.loading = this.commonrearformService.loading;
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
    this.subscribeAll$['getTreeSxDept$'] = this.commonrearformService.getTreeSxDept().subscribe(res => {
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
    this.validateForm.reset(this.commonrearformService.defalutData);
  }


  ngOnInit(): void {
    this.initForm();
    this.getTreeSxDept();
  }

  initForm() {
    const { deptName, state, rangePicker, userId } = this.commonrearformService.defalutData;
    this.validateForm = this.fb.group({
      deptName: [deptName],  // 部门 学院
      userId: [userId],  // 班主任
      state: [state],   // 在岗状态
      rangePicker: [rangePicker]  // 日期范围
    });
  }


  ngOnDestroy() {
    this.loading = this.commonrearformService.loading = false;
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
