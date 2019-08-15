import { Component, OnInit, Output, EventEmitter, Input, DoCheck, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MiddleEndSearchFormService } from '../../service/middleEndSearchForm.service';
import { FlowcommonformService } from 'src/app/modules/flow/service/flowcommonform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { rangePickerTodayDisabledDate, setDefaultDate } from 'src/app/tools';
@Component({
  selector: 'app-commonsearch-form',
  templateUrl: './commonsearch-form.component.html',
  styleUrls: ['./commonsearch-form.component.scss']
})
export class CommonsearchFormComponent implements OnInit, DoCheck, OnDestroy {
  @Output() sendQueryData = new EventEmitter();
  @Input() isShowPopularize: Boolean = true;
  public loading: Boolean = false;
  public rangePickerDisabledDate: Function = rangePickerTodayDisabledDate;

  // public optionsLoading: Boolean = false;
  // private subscribeAll$: Object = {};
  // public deptIdOptions:  Array<Object> = []; // 军团下拉列表
  // public groupIdOptions:  Array<Object> = []; // 咨询组下拉列表
  // public userIdOptions:  Array<Object> = []; // 咨询师下拉列表
  // public codeOptions:  Array<Object> = []; // 推广渠道下拉列表
  // public extensionSourceOptions:  Array<Object> = []; // 推广来源下拉列表
  // public cityNameOptions:  Array<Object> = []; // 推广城市下拉列表
  // public advertisersTypeOptions:  Array<Object> = []; // 推广方式下拉列表
  // public accountUidOptions:  Array<Object> = []; // 推广人下拉列表

  public timeTypes: Array<Object> = this.middleEndSearchFormService.timeTypes;

  public paramsAll = {};

  public validateForm: FormGroup;
  constructor(private fb: FormBuilder, public flowcommonform: FlowcommonformService,
     public middleEndSearchFormService: MiddleEndSearchFormService, public commonCustomService: CommonCustomService) { }

  ngOnInit(): void {
    this._initForm();
   }

  ngDoCheck() {
    if (this.loading !== this.middleEndSearchFormService.loading) {
      this.loading = this.middleEndSearchFormService.loading;
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
    if (!this.isShowPopularize) {
      delete mergeParams['code'];
      delete mergeParams['cityName'];
      delete mergeParams['accountUid'];
      delete mergeParams['source'];
    } else {
      if (mergeParams['source'] === '全部') {
        delete mergeParams['source'];
      }
    }
    this.sendQueryData.emit(mergeParams);
  }
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset(this.middleEndSearchFormService.defalutData);
    // this.submitForm();
  }


  /**
   * 设置查询 事业部 军团 咨询组 咨询师查询参数
   */
  private _setAssociationParams() {
    const keys = ['deptId', 'groupId', 'userId'];
    for (const key in this.validateForm.value) {
      if (this.validateForm.value.hasOwnProperty(key)) {
        const element = this.validateForm.value[key];
        if (keys.includes(key) && element) {
          if (key === 'deptId') {
            this.paramsAll['legion'] = element;
          } else if (key === 'groupId') {
            this.paramsAll['group'] = element;
          } else {
            this.paramsAll[key] = element;
          }
        }
      }
    }
  }


  _initForm() {
    const { deptId, groupId, userId, rangePicker, periodType, code,
      cityName, accountUid, source } = this.middleEndSearchFormService.defalutData;
    this.validateForm = this.fb.group({
      deptId: [deptId],  // 军团
      groupId: [groupId],   // 咨询组
      userId: [userId],   // 咨询师
      code: [code],  // 推广渠道
      cityName: [cityName],  // 推广城市
      accountUid: [accountUid],   // 推广人
      source: [source],  // 推广来源
      periodType: [periodType],  // 时间类型
      rangePicker: [rangePicker]  // 时间范围
    });
  }


  alllegionChangeEvent(val) {
    this.validateForm.get('groupId').patchValue([]);
    this.validateForm.get('userId').patchValue([]);
    // this.checkAllData['groupId'] = null;
    // this.checkAllData['userId'] = null;
    this._setAssociationParams();
  }

  allmiddleGroupChangeEvent(val) {
    this.validateForm.get('userId').patchValue([]);
    // this.checkAllData['userId'] = null;
    this._setAssociationParams();
  }



  periodTypeChange(periodType) {
    const nowDate = new Date();
    const startTime = setDefaultDate(periodType, true);
    const rangePicker = periodType === 'period_wid' ?  [startTime, startTime] : [startTime, nowDate];
    this.validateForm.get('rangePicker').patchValue(rangePicker);
  }


  ngOnDestroy() {
    this.loading = this.middleEndSearchFormService.loading = false;
    // this.commonCustomService.unsubscribe(this.subscribeAll$);
  }


  // legionChangeEvent() {
  //   this.validateForm.get('groupId').patchValue(null);
  // }

  // openLegionChange(isOpen) {
  //   if (isOpen) {
  //     this.getMiddleLegion();
  //   }
  // }

  /**
   * 获取军团
   * @param dept Array
   */
  // getMiddleLegion(searchVal: String = '') {

  //   this.optionsLoading = true;
  //   this.subscribeAll$['getLegion$'] = this.middleEndSearchFormService.getMiddleLegion({searchVal}).subscribe((res) => {
  //     this.deptIdOptions = res.result;
  //     this.optionsLoading = false;
  //   });
  // }



  // middleGroupChangeEvent() {
  //   this.validateForm.get('userId').patchValue(null);
  // }


  // openMiddleGroupChange(isOpen) {
  //   if (isOpen) {
  //     this.getMiddleGroup();
  //   }
  // }

  /**
   * 获取咨询组
   * @param searchVal String
   */
  // getMiddleGroup(searchVal: String = '') {
  //   const params = { searchVal };
  //   const dept = this.validateForm.get('deptId').value;
  //   if (dept && dept.length) {
  //     params['dept'] = dept;
  //   }
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getMiddleGroup$'] = this.middleEndSearchFormService.getMiddleGroup(params).subscribe((res) => {
  //     this.groupIdOptions = res.result;
  //     this.optionsLoading = false;
  //   });
  // }


  // openUserIdChange(isOpen) {
  //   if (isOpen) {
  //     this.getMiddleUser();
  //   }
  // }

  /**
   * 获取咨询师
   * @param searchVal String
   */
  // getMiddleUser(searchVal: String = '') {
  //   const params = { searchVal };
  //   const dept = this.validateForm.get('groupId').value;
  //   if (dept && dept.length) {
  //     params['dept'] = dept;
  //   }
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getMiddleUser$'] = this.middleEndSearchFormService.getMiddleUser(params).subscribe((res) => {
  //     this.userIdOptions = res.result;
  //     this.optionsLoading = false;
  //   });
  // }



  // openCodeChange(isOpen) {
  //   if (!this.codeOptions.length && isOpen) {
  //     this.getCodeOptions();
  //   }
  // }
  /**
   * 获取推广渠道
   */
  // getCodeOptions(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getCodeOptions$'] = this.flowcommonform.getCodeOptions({ searchVal }).subscribe(result => {
  //     this.codeOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }


  // openQuerySourceNameChange(isOpen) {
  //   if (!this.extensionSourceOptions.length && isOpen) {
  //     this.getQuerySourceName();
  //   }
  // }


  /**
   * 获取推广来源
   */
  // getQuerySourceName(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getQuerySourceName$'] = this.flowcommonform.getQuerySourceName({ searchVal }).subscribe(result => {
  //     this.flowcommonform.sourceOptions = this.extensionSourceOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }



  // openCityNameChange(isOpen) {
  //   if (!this.cityNameOptions.length && isOpen) {
  //     this.getSpreadCitylist();
  //   }
  // }
  /**
   * 获取推广城市下拉列表
   */
  // getSpreadCitylist(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getSpreadCitylist$'] = this.flowcommonform.getSpreadCitylist({ searchVal }).subscribe(result => {
  //     this.cityNameOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }


  // openAdvertisersTypeChange() {
  //   if (!this.advertisersTypeOptions.length) {
  //     this.getAdvertisersTypeOptions();
  //   }
  // }
  /**
   * 获取推广方式
   */
  // getAdvertisersTypeOptions(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getAdvertisersTypeOptions$'] = this.flowcommonform.getAdvertisersTypeOptions({ searchVal })
  //     .subscribe(result => {
  //       this.advertisersTypeOptions = result.result;
  //       this.optionsLoading = false;
  //     });
  // }

  // openPromoterNameChange(isOpen) {
  //   if (!this.accountUidOptions.length && isOpen) {
  //     this.getPromoterName();
  //   }
  // }

  /**
   * 获取推广人
   * @param searchVal String 搜索条件
   */
  // getPromoterName(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getAdvertisersTypeOptions$'] = this.commonCustomService.getPromoterName({ searchVal })
  //     .subscribe(result => {
  //       this.accountUidOptions = result.result;
  //       this.optionsLoading = false;
  //     });
  // }

}
