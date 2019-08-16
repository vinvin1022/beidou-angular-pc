import { Component, OnInit, Output, EventEmitter, Input, DoCheck, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { setDefaultDate, rangePickerTodayDisabledDate, setFinalFilterData } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

import { FrontendService } from '../../service/frontend.service';
import { FrontRealFormService } from '../../service/front-real-form.service';
import { FlowcommonformService } from 'src/app/modules/flow/service/flowcommonform.service';


@Component({
  selector: 'app-front-real-form',
  templateUrl: './front-real-form.component.html',
  styleUrls: ['./front-real-form.component.scss']
})
export class FrontRealFormComponent implements OnInit, DoCheck, OnDestroy {
  @Input() isShowDept0 = true;  // 是否显示模式
  @Input() isShowRangePicker = false;  // 是否显示时间
  @Input() isShowAdvertisersTypeList = true; // 是否显示推广方式
  @Output() sendQueryData = new EventEmitter();


  public rangePickerTodayDisabledDate: (current: Date) => boolean = rangePickerTodayDisabledDate;
  public loading = false;

  public customColumnData: object = {};
  public paramsAll = {};
  public validateForm: FormGroup;
  constructor(private fb: FormBuilder, public frontRealFormService: FrontRealFormService, public frontendService: FrontendService,
    public commonCustomService: CommonCustomService, public flowcommonform: FlowcommonformService) { }

  ngOnInit(): void {
    this._initForm();
    // this._setAssociationParams();
  }


  ngDoCheck() {
    if (this.loading !== this.frontRealFormService.loading) {
      this.loading = this.frontRealFormService.loading;
    }
  }
  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    const mergeParams = setFinalFilterData(this.validateForm.value);
    this.sendQueryData.emit(mergeParams);
  }


  rangePickerDisabledDate(current: Date): boolean {
    const currentTime = new Date(current).getTime();
    const today = new Date().getTime();
    return currentTime - today > 0;
  }

  private _initForm(): void {
    const { dept0, dept, legion, group, userId, advertisersTypeList, rangePicker } = this.frontRealFormService.defalutData;
    this.validateForm = this.fb.group({
      dept0, // 模式
      dept,  // 事业部
      legion,  // 军团
      group,  // 咨询组
      userId,  // 咨询师
      advertisersTypeList, // 推广方式
      rangePicker: [rangePicker]  // 时间范围
    });
  }
  /**
   * 设置查询 事业部 军团 咨询组 咨询师查询参数
   */
  private _setAssociationParams() {
    this.paramsAll = setFinalFilterData(this.validateForm.value);
  }

  alldept0ChangeEvent(val) {
    this.validateForm.get('dept').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('legion').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('group').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
  }

  alldeptChangeEvent(val): void {
    this.validateForm.get('legion').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('group').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
  }

  alllegionChangeEvent(val): void {
    this.validateForm.get('group').patchValue([], { emitViewToModelChange: false });
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
    this.validateForm.reset(this.frontRealFormService.defalutData);
  }


  ngOnDestroy() {
    this.loading = this.frontRealFormService.loading = false;
  }
}
