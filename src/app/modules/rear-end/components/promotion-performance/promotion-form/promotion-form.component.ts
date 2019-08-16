import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';


import { PromotionformService } from '../../../service/promotion-form.service';
import { rangePickerTodayDisabledDate } from 'src/app/tools';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss']
})
export class PromotionFormComponent implements OnInit, OnDestroy, DoCheck {
  @Output() sendQueryData = new EventEmitter();
  @Input() isShowDutyState = true;
  @Input() isShowRangePicker = true;
  public loading = false;
  public rangePickerDisabledDate: (current) => void = rangePickerTodayDisabledDate;
  public subscribeAll$: object = {};
  public paramsAll: object = {};
  public validateForm: FormGroup;

  constructor(private fb: FormBuilder, public promotionformService: PromotionformService,
    private commonCustomService: CommonCustomService) { }

  ngDoCheck() {
    if (this.loading !== this.promotionformService.loading) {
      this.loading = this.promotionformService.loading;
    }
  }

  deptNamesChange(deptNames) {
    this.validateForm.get('teacherIds').patchValue([]);
    if (deptNames && deptNames.length) {
      this.paramsAll['deptNames'] = deptNames;
    } else {
      delete this.paramsAll['deptNames'];
    }
  }




  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    if (!this.isShowDutyState || this.validateForm.value['userState'] === '全部') {
      delete this.validateForm.value['userState'];
    }
    if (!this.isShowRangePicker) {
      delete this.validateForm.value['rangePicker'];
    }
    this.sendQueryData.emit(this.validateForm.value);
  }


  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset(this.promotionformService.defalutData);
  }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const { deptNames, userState, rangePicker, teacherIds } = this.promotionformService.defalutData;
    this.validateForm = this.fb.group({
      deptNames,  // 部门 学院
      teacherIds,  // 班主任
      userState,   // 在岗状态
      rangePicker: [rangePicker]  // 日期范围
    });
  }


  ngOnDestroy() {
    this.loading = this.promotionformService.loading = false;
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
