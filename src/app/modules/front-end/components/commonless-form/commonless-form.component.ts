import { Component, OnInit, Output, EventEmitter, Input, DoCheck, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LessformService } from '../../service/lessform.service';
import { setDefaultDate, rangePickerTodayDisabledDate, setFinalFilterData } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { FrontendService } from '../../service/frontend.service';

import { Router } from '@angular/router';
import { ElectricControlService } from '../../service/electriccontrol.service';

@Component({
  selector: 'app-commonless-form',
  templateUrl: './commonless-form.component.html',
  styleUrls: ['./commonless-form.component.scss']
})
export class CommonlessFormComponent implements OnInit, DoCheck, OnDestroy {
  @Output() sendQueryData = new EventEmitter();
  @Input() isShowRangePicker = true;


  public rangePickerTodayDisabledDate: Function = rangePickerTodayDisabledDate;
  public loading: Boolean = false;

  public customColumnData: object = {};
  public flowDataType: String = '1';   // 1电销 2网销
  public checkAllData: object = {};
  public paramsAll = {};
  public validateForm: FormGroup;
  constructor(private fb: FormBuilder, private lessformService: LessformService, public frontendService: FrontendService,
    public commonCustomService: CommonCustomService, private router: Router, private electricControlService: ElectricControlService) { }

  ngOnInit(): void {
    this._setFlowDataType();
    this._initForm();
    this._setAssociationParams();
  }


  ngDoCheck() {
    if (this.loading !== this.lessformService.loading) {
      this.loading = this.lessformService.loading;
    }
  }
  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }

    const mergeParams = setFinalFilterData(Object.assign({}, this.validateForm.value));
    if (!this.isShowRangePicker) {
      delete mergeParams['periodType'];
      delete mergeParams['startTime'];
      delete mergeParams['endTime'];
    }
    this.sendQueryData.emit(mergeParams);
  }

  /**
   * 设置查询 事业部 军团 咨询组 咨询师查询参数
   */
  private _setAssociationParams() {
    const keys = ['business', 'deptId1', 'deptId2'];
    for (const key in this.validateForm.value) {
      if (this.validateForm.value.hasOwnProperty(key)) {
        const element = this.validateForm.value[key];
        if (keys.includes(key) && element) {
          if (key === 'business') {
            this.paramsAll['dept'] = element;
          } else if (key === 'deptId1') {
            this.paramsAll['legion'] = element;
          } else if (key === 'deptId2') {
            this.paramsAll['group'] = element;
          } else {
            this.paramsAll[key] = element;
          }
        }
      }
    }
    this.paramsAll['flowDataType'] = this.flowDataType;
  }

  private _initForm(): void {
    const { periodType, rangePicker, business, deptId1, deptId2, userId } = this.lessformService.defalutData;
    this.validateForm = this.fb.group({
      business,  // 事业部
      deptId1,  // 军团
      deptId2,  // 咨询组
      userId,  // 咨询师
      periodType: [periodType],  // 时间类型
      rangePicker: [rangePicker]  // 时间范围
    });
  }




  allbusinessChangeEvent(val): void {
    this.validateForm.get('deptId1').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('deptId2').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
  }

  alllegionChangeEvent(val): void {
    this.validateForm.get('deptId2').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
  }

  allfrontGroupChangeEvent(val): void {
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
  }


  resetForm(e: MouseEvent): void {
    e.preventDefault();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.validateForm.reset(this.lessformService.defalutData);
  }


  periodTypeChange(periodType = 'period_wid') {
    const nowDate = new Date();
    const startTime = setDefaultDate(periodType, true);
    const rangePicker = periodType === 'period_wid' ? [startTime, startTime] : [startTime, nowDate];
    this.electricControlService.periodType = periodType;
    this.validateForm.get('rangePicker').patchValue(rangePicker);
  }

  private _setFlowDataType() {
    const url = this.router.url.split('/');
    if (url[2] === 'electricControl' || url[2] === 'electricStatistics') {
      this.flowDataType = '1';
    } else if (url[2] === 'incubationProject') {
      this.flowDataType = '3';
    } else {
      this.flowDataType = '2';
    }
  }

  ngOnDestroy() {
    this.loading = this.lessformService.loading = false;
    this.electricControlService.periodType = 'period_wid';
  }
}
