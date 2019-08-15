import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MoreformService } from '../../service/moreform.service';
import { rangePickerTodayDisabledDate } from '../../../../tools';
import { FlowcommonformService } from 'src/app/modules/flow/service/flowcommonform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { FrontendService } from '../../service/frontend.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-commonmore-form',
  templateUrl: './commonmore-form.component.html',
  styleUrls: ['./commonmore-form.component.scss']
})
export class CommonmoreFormComponent implements OnInit, OnDestroy, DoCheck {
  @Output() sendQueryData = new EventEmitter();
  @Input() isShowSource: Boolean = true;   // 是否显示推广来源
  @Input() isShowWay: Boolean = true;  // 是否推广方式
  public loading: Boolean = false;
  public rangePickerDisabledDate: Function = rangePickerTodayDisabledDate;
  // private subscribeAll$: Object = {};
  // public optionsLoading: Boolean = false;

  // public condepartment: String = '';
  // public businessOptions: Array<Object> = [];  // 事业部下拉列表
  // public deptId1Options: Array<Object> = [];   // 军团下拉选项

  // public deptId2Options: Array<Object> = [];   // 咨询组下拉选项
  // public userIdOptions: Array<Object> = [];  // 咨询师下拉选项

  // public codeOptions: Array<Object> = [];   // 推广渠道

  // public advertisersTypeOptions: Array<Object> = [];   // 推广方式
  // public cityNameOptions: Array<Object> = [];   // 推广城市

  // public accountUidOptions = [];

  // public extensionSourceOptions: Array<Object> = [];   // 推广来源

  public flowDataType: String = '1';   // 1电销 2网销

  public groupDimensionOptions = this.moreformService.groupDimensionOptions;
  public paramsAll = {};


  public validateForm: FormGroup;
  constructor(private fb: FormBuilder, public flowcommonform: FlowcommonformService,
    private moreformService: MoreformService, public frontendService: FrontendService,
    public commonCustomService: CommonCustomService, private router: Router) { }



  ngOnInit(): void {
    this._setFlowDataType();
    this.initForm();
    this._setAssociationParams();
    // this.getQuerySourceName();
  }
  ngDoCheck() {
    if (this.loading !== this.moreformService.loading) {
      this.loading = this.moreformService.loading;
    }
  }
  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    const mergeParams = Object.assign({}, this.validateForm.value);
    if (!this.isShowSource || mergeParams['source'] === '全部') {
      delete mergeParams['source'];
    }
    if (!this.isShowWay || mergeParams['advertisersType'] === '全部') {
      delete mergeParams['advertisersType'];
    }
    this.sendQueryData.emit(mergeParams);
  }


  resetForm(e: MouseEvent): void {
    e.preventDefault();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.validateForm.reset(this.moreformService.defalutData);
  }


  private _setFlowDataType() {
    const url = this.router.url.split('/');
    if (url[2] === 'netIndex' || url[2] === 'netStatistics') {
      this.flowDataType = '2';
    } else {
      this.flowDataType = '1';
    }
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


  initForm() {
    const { business, deptId1, deptId2, userId, code, source, advertisersType, cityName, accountUid, rangePicker, groupDimension } =
      this.moreformService.defalutData;
    this.validateForm = this.fb.group({
      business: [business],  // 事业部
      deptId1: [deptId1],   // 军团
      deptId2: [deptId2],  // 咨询组
      userId: [userId],   // 咨询师
      code: [code],  // 推广渠道
      cityName: [cityName],  // 推广城市
      advertisersType: [advertisersType],   // 推广方式
      accountUid: [accountUid],   // 推广人
      source: [source],  // 推广来源
      rangePicker: [rangePicker],  // 时间范围
      groupDimension: [groupDimension] // 维度
    });
  }

  allbusinessChangeEvent(val) {
    this.validateForm.get('deptId1').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('deptId2').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });

    this._setAssociationParams();
  }

  alllegionChangeEvent(val) {
    this.validateForm.get('deptId2').patchValue([], { emitViewToModelChange: false });
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
    // this.checkAllData['deptId2'] = null;
    // this.checkAllData['userId'] = null;
  }

  allfrontGroupChangeEvent(val) {
    this.validateForm.get('userId').patchValue([], { emitViewToModelChange: false });
    this._setAssociationParams();
    // this.checkAllData['userId'] = null;
  }

  ngOnDestroy() {
    this.loading = this.moreformService.loading = false;
  }
}
