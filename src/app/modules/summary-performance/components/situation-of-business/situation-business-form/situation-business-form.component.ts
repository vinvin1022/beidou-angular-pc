import { Component, OnInit, Output, EventEmitter, Input, DoCheck, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { rangePickerTodayDisabledDate, setFinalFilterData } from '../../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

import { SituationBusinessFormService } from '../../../service/situation-business-form.service';


@Component({
  selector: 'app-situation-business-form',
  templateUrl: './situation-business-form.component.html',
  styleUrls: ['./situation-business-form.component.scss']
})
export class SituationBusinessFormComponent implements OnInit, DoCheck, OnDestroy {
  @Output() sendQueryData = new EventEmitter();


  public rangePickerTodayDisabledDate: Function = rangePickerTodayDisabledDate;
  public loading: Boolean = false;

  public customColumnData: object = {};
  public paramsAll = {};
  public validateForm: FormGroup;
  constructor(private fb: FormBuilder, public situationBusinessFormService: SituationBusinessFormService,
    public commonCustomService: CommonCustomService) { }

  ngOnInit(): void {
    this._initForm();
    // this._setAssociationParams();
  }


  ngDoCheck() {
    if (this.loading !== this.situationBusinessFormService.loading) {
      this.loading = this.situationBusinessFormService.loading;
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

  /**
  * 设置最终选择的form数据
  */
  setSelectedData() {
    const paramsData: Object = {};
    const mergeParams = Object.assign({}, this.validateForm.value);
    Object.keys(mergeParams).forEach((value) => {
      if (mergeParams[value]) {
        if (value === 'advertisersTypeList') {
          if (mergeParams[value] === '全部') {
            paramsData[value] = [];
          } else if (typeof mergeParams[value] === 'string') {
            paramsData[value] = [mergeParams[value]];
          }
        } else {
          paramsData[value] = mergeParams[value];
        }
      }
    });
    return paramsData;
  }


  private _initForm(): void {
    const { dept0, dept, advertisersNameList, advertisersLegion, advertisersTypeList } = this.situationBusinessFormService['defalutData'];
    this.validateForm = this.fb.group({
      dept0, // 模式
      dept,  // 事业部
      advertisersLegion,  // 流量军团
      advertisersNameList,  // 推广渠道
      advertisersTypeList // 推广方式
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
    this.validateForm.get('advertisersLegion').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
  }

  alldeptChangeEvent(val): void {
    this.validateForm.get('advertisersLegion').patchValue([], { emitViewToModelChange: false });
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
    this.validateForm.reset(this.situationBusinessFormService.defalutData);
  }


  ngOnDestroy() {
    this.loading = this.situationBusinessFormService.loading = false;
  }
}
