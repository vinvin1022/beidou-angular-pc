import { Component, OnInit, Inject, forwardRef, ViewEncapsulation, Output, EventEmitter, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PandectService } from '../../../service/pandect.service';
import { rangePickerDisabledDate, setDefaultDate } from '../../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-summary-performance',
  templateUrl: './summary-performance.component.html',
  styleUrls: ['./summary-performance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryPerformanceComponent implements OnInit, DoCheck {
  // public deptOptions: Array<Object> = this.pandect.deptOptions;

  public timeTypes: Array<Object> = this.pandect.timeTypes;
  public indexItems: Array<Object> = this.pandect.indexItems;
  public validateForm: FormGroup;
  public isSubmit: Boolean = false;
  public loading: Boolean = false;
  // public departmentOptions: Array<Object> = [];
  // public userIdOptions: Array<any> = [];
  public rangePickerDisabledDate: Function = rangePickerDisabledDate;
  // public businessOptions: Array<Object> = [];
  public optionsLoading: Boolean = false;
  public subscribeAll$: Object = {};
  @Output('sendQueryData') sendQueryData = new EventEmitter();
  constructor(private fb: FormBuilder, private pandect: PandectService, private message: NzMessageService,
    public commonCustomService: CommonCustomService) { }


  /**
   * 提交
   */
  submitForm(): boolean {
    this.markAsPristineFrom();
    const mergeParams = Object.assign({}, this.validateForm.value);
    if (this.validateForm.get('dept').invalid) {
      this.message.error('咨询部门为必填');
      return false;
    }
    this.sendQueryData.emit(mergeParams);
  }

  /**
   * 重置数据
   * @param e MouseEvent
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.isSubmit = false;
    this.validateForm.reset(this.pandect.defaultFormData);
    this.markAsPristineFrom();
    // this.sendQueryData.emit(this.validateForm.value);
  }

  /**
   * 清除form状态
   */
  markAsPristineFrom() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }


  ngOnInit(): void {
    this.initForm();
  }
  periodTypeChange(periodType) {
    const nowDate = new Date();
    const startTime = setDefaultDate(periodType);
    this.validateForm.get('rangePicker').patchValue([startTime, nowDate]);
  }



  _setEndTime(num) {
    const nowTimeDate = new Date();
    const time = nowTimeDate.getTime();
    const dayTime = 24 * 3600 * 1000;
    const day = nowTimeDate.getDay() === 0 ? num : nowTimeDate.getDay();
    const endvalue = time - (day * dayTime) + dayTime;
    return endvalue;
  }
  ngDoCheck() {
    if (this.loading !== this.pandect.loading) {
      this.loading = this.pandect.loading;
    }
  }

  initForm() {
    const { dept, periodType, rangePicker, indexItem } = this.pandect.defaultFormData;
    this.validateForm = this.fb.group({
      dept: [dept, [Validators.required]],
      rangePicker: [rangePicker],
      periodType: [periodType],
      indexItem: [indexItem]
    });
  }



}
