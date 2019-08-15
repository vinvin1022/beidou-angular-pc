import {
  Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, OnDestroy,
  DoCheck, TemplateRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlowcommonformService } from '../../service/flowcommonform.service';
import { changeJson, setDefaultDate, setPurviewDefaultDate } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonFormComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('formtitle', { static: false }) formtitle: TemplateRef<any>;
  // 是否显示条件
  public isShowMore = this.flowcommonform.isShowMore;
  // 查询包管理权限控制
  @Input() packagePermissions = 'b030102';
  // 是否显示报名城市
  @Input() isShowRegistCity = this.flowcommonform.isShowRegistCity;
  // 是否显示维度
  @Input() isShowDimension = this.flowcommonform.isShowDimension;
  // 是否显示对比时间
  @Input() isShowContrast: boolean = this.flowcommonform.isShowContrast;
  // 是否显示年条件
  @Input() isShowYear: boolean = this.flowcommonform.isShowYear;
  // 是否显示查询包管理
  @Input() isShowMyQueryPacket = true;

  @Input() isShowMenAreaName = true;
  // 是否显示时间范围
  @Input() isShowPurview = false;
  // 我的查询包url
  @Input() queryPacketUrl = '/flow/genQueryPacket';

  @Output() sendQueryData = new EventEmitter<any>();
  public flowDataTypeOptions = []; // 业务模式
  public carrierOptions: Array<object> = [];   // 载体
  public size = 'defalut';

  // public menAreaCodeOptions: Array<Object> = [];  // 城市名称
  // public flConsultingProjectOptions: Array<Object> = [];   // 推广项目下拉选项
  // public sourceOptions: Array<Object> = [];   // 推广来源下拉选项
  // public codeOptions: Array<Object> = [];   // 推广渠道
  // public advertisersTypeOptions: Array<Object> = [];   // 推广方式
  // public webUidOptions: Array<Object> = [];    // 主域名
  // public deptId1Options: Array<Object> = [];   // 流量军团下拉选项
  // public deptId2Options: Array<Object> = [];   // 流量组下拉选项
  // public userIdOptions: Array<Object> = [];   // 流量人员下拉选项
  // public accountUidOptions = [];   // 推广账户下拉选项
  // public siteNumberOptions = [];   // 推广站点下拉选项
  // public accountUidsOptions: Array<Object> = [];    // 推广账户包下拉选项
  // public siteNumbersOptions: Array<Object> = [];    // 推广站点包下拉选项
  // public cityNameOptions: Array<Object> = [];   // 推广城市下拉选项

  public queryDimensionOptions: Array<object> = [];   // 维度
  public isSubmit = true;
  public subscribeAll$ = {}; // 订阅的所有事件
  public validateForm: FormGroup;
  public accountUidDisabled = false;   // 是否禁用推广账户选项
  public siteNumberDisabled = false;   // 是否禁用推广站点选项
  public accountUidPackageDisabled = false;   // 是否禁用推广账户选项
  public siteNumberPackageDisabled = false;   // 是否禁用推广站点选项
  public loading = false;
  // public siteNumberParams: Object = { state: 0 };  // 推广站点查询参数
  // public optionsLoading: Boolean = false;





  public checkAllData = {};
  public paramsAll = {};

  // public allsiteNumberOptions: Array<any> = [];


  constructor(private fb: FormBuilder, public flowcommonform: FlowcommonformService, private commonCustomService: CommonCustomService) { }

  /**
   * 重置数据
   * @param e MouseEvent
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.isSubmit = false;
    this.validateForm.reset(this.flowcommonform.defaultFormData);
    // this._setCheckAll();
    this.markAsPristineFrom();
  }


  /**
   * 提交数据
   */
  submitForm(): void {
    this.isSubmit = true;
    this.markAsPristineFrom();
    const formData = this.setSelectedData();
    this.sendQueryData.emit({ ...formData });
    // this.isShowMore = false;
  }


  ngOnInit(): void {
    this.flowDataTypeOptions = this.flowcommonform.flowDataTypeOptions; // 业务模式
    this.carrierOptions = this.flowcommonform.carrierOptions;   // 载体
    // this._setCheckAll();
    this.initForm();
    // this.getSpreadCitylist();
    // this.getQueryAccount();
    // this.getFlConsultingProjectOptions();  // 获取推广项目
    // this.getSiteNumberOptions();   // 获取推广站点下拉选项
    // this.getMenAreaCodeOptions();  // 获取报名城市下拉列表
    // this.getAdvertisersTypeOptions();
    // this.getWebUidOptions();  // 获取主域名下拉选项
    // this.getCodeOptions();  // 获取推广渠道下拉选项
    // this.getQueryAccountPackage();  // 获取推广账户包
    // this.getQuerySitePackage();  // 获取推广站点包
    this.filterQueryDimensionOptions();
    // this.getDeptOptions();   // 获取流量军团
    this.periodTypeChange();
    // this.getQuerySourceName();   // 获取推广来源下拉选项

  }

  ngDoCheck() {
    if (this.loading !== this.flowcommonform.loading) {
      this.loading = this.flowcommonform.loading;
    }
  }

  /**
   * 过滤报名城市
   */
  filterQueryDimensionOptions() {
    if (!this.isShowMenAreaName) {
      this.queryDimensionOptions = this.flowcommonform.queryDimensionOptions.filter(item => item['key'] !== 'men_area_name');
    } else {
      this.queryDimensionOptions = this.flowcommonform.queryDimensionOptions;
    }
  }

  /**
   * form初始化
   */
  markAsPristineFrom() {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }
  /**
   * 初始化表单
   */
  initForm() {
    const { menAreaCode, flowDataType, flConsultingProject, periodType, rangePicker, contrastRangePicker, deptId1,
      deptId2, userId, accountUid, siteNumber, accountUids, siteNumbers,
      webUid, code, cityName, advertisersType, carrier, source, queryDimension,
      isContrast, contrastStartTime, contrastEndTime, startTime, endTime } = this.flowcommonform.defaultFormData;
    this.validateForm = this.fb.group({
      menAreaCode: [menAreaCode],   // 报名城市
      flowDataType: [flowDataType],  // 业务模式
      flConsultingProject: [flConsultingProject],  // 推广项目
      deptId1: [deptId1],   // 流量军团
      deptId2: [deptId2],  // 流量组
      userId: [userId],  // 流量人员
      accountUid: [accountUid],   // 推广账户
      siteNumber: [siteNumber],   // 推广站点
      accountUids: [accountUids],  // 推广账户包
      siteNumbers: [siteNumbers],  // 推广站点包
      webUid: [webUid],   // 主域名
      code: [code],  // 推广渠道
      cityName: [cityName],  // 推广城市
      carrier: [carrier],   // 载体
      source: [source],  // 推广来源

      periodType: [periodType],   // 时间类型
      rangePicker: [rangePicker],   // 时间类型范围值
      contrastRangePicker: [contrastRangePicker], // 时间类型对比范围值
      advertisersType: [advertisersType],   // 推广方式
      queryDimension: [queryDimension], // 维度
      isContrast: [isContrast],  // 是否对比
      contrastStartTime: [contrastStartTime],
      contrastEndTime: [contrastEndTime],
      startTime: [startTime],
      endTime: [endTime]
    });
  }

  private _setCheckAll() {
    const { menAreaCode, flowDataType, flConsultingProject, deptId1, deptId2, userId, accountUid, siteNumber, accountUids, siteNumbers,
      webUid, code, cityName, carrier, advertisersType, source } = this.flowcommonform.defaultFormData;
    this.checkAllData = {
      // menAreaCode: menAreaCode,  // 报名城市
      // flowDataType: flowDataType, // 业务模式
      // flConsultingProject: flConsultingProject, // 推广项目
      // deptId1: deptId1, // 流量军团
      // deptId2: deptId2, // 流量组
      // userId: userId, // 流量人员
      // accountUid: accountUid, // 推广账户
      // siteNumber: siteNumber, // 推广站点
      // accountUids: accountUids, // 推广账户包
      // siteNumbers: siteNumbers, // 推广站点包
      // webUid: webUid, // 主域名
      // code: code, // 推广渠道
      // cityName: cityName, // 推广城市
      // carrier: carrier,  // 载体
      // advertisersType: advertisersType, // 推广方式
      // source: source // 推广来源
    };
  }



  allSiteNumberChange(siteNumber) {
    if (siteNumber && siteNumber.length) {
      this.siteNumberDisabled = false;
      this.siteNumberPackageDisabled = true;
    } else {
      this.siteNumberPackageDisabled = false;
    }
  }

  allAccountUidChange(accountUids) {
    // this.checkAllData['siteNumber'] = null;
    const { siteNumber } = this.flowcommonform.defaultFormData;
    this.validateForm.patchValue({ siteNumber });
    this._setAssociationParams();
    if (accountUids && accountUids.length) {
      this.accountUidDisabled = false;
      this.accountUidPackageDisabled = true;
    } else {
      this.accountUidPackageDisabled = false;
    }
  }
  allUserIdChange(val) {
    // this.checkAllData['accountUid'] = null;
    // this.checkAllData['siteNumber'] = null;
    const { accountUid, siteNumber } = this.flowcommonform.defaultFormData;
    this.validateForm.patchValue({
      accountUid,
      siteNumber
    });
    this._setAssociationParams();
  }

  alldeptId1Change(val) {
    // this.checkAllData['deptId2'] = null;
    // this.checkAllData['userId'] = null;
    // this.checkAllData['accountUid'] = null;
    // this.checkAllData['siteNumber'] = null;
    const { deptId2, userId, accountUid, siteNumber } = this.flowcommonform.defaultFormData;
    this.validateForm.patchValue({
      deptId2,
      userId,
      accountUid,
      siteNumber
    });
    this._setAssociationParams();
  }

  alldeptId2Change(val) {
    // this.checkAllData['userId'] = null;
    // this.checkAllData['accountUid'] = null;
    // this.checkAllData['siteNumber'] = null;

    const { userId, accountUid, siteNumber } = this.flowcommonform.defaultFormData;
    this.validateForm.patchValue({
      userId,
      accountUid,
      siteNumber
    });
    this._setAssociationParams();
  }


  /**
   * 推广账户包变动事件
   * @param accountUidPackage Array 推广账户包
   */
  accountUidPackageChange(accountUidPackage) {
    if (accountUidPackage && accountUidPackage.length) {
      this.accountUidDisabled = true;
      this.accountUidPackageDisabled = false;
    } else {
      this.accountUidDisabled = false;
    }
  }


  /**
   * 推广站点包变动事件
   * @param siteNumberPackage Array 推广站点包
   */
  siteNumberPackageChange(siteNumberPackage: Array<any>) {
    if (siteNumberPackage && siteNumberPackage.length) {
      this.siteNumberDisabled = true;
      this.siteNumberPackageDisabled = false;
    } else {
      this.siteNumberDisabled = false;
    }
  }



  private _setAssociationParams() {
    this.paramsAll = {};
    const keys = ['deptId1', 'deptId2', 'userId', 'accountUid'];
    for (const key in this.validateForm.value) {
      if (this.validateForm.value.hasOwnProperty(key)) {
        const element = this.validateForm.value[key];
        if (keys.includes(key) && element) {
          if (key === 'deptId1') {
            this.paramsAll['dept'] = element;
          } else if (key === 'deptId2') {
            this.paramsAll['legion'] = element;
          } else {
            this.paramsAll[key] = element;
          }
        }
      }
    }
  }





  /**
   * 对比开始时间变动事件
   * @param paramstartTime Date 对比开始时间
   */
  contrastStartTimeChange(paramstartTime: Date) {
    if (paramstartTime) {
      const [startTime, endTime] = this.validateForm.value.rangePicker;
      const diffTime = new Date(endTime).getTime() - new Date(startTime).getTime();
      const contrastEndTime = new Date(paramstartTime).getTime() + diffTime;
      this.validateForm.patchValue({ contrastEndTime: new Date(contrastEndTime) });
    }
  }



  /**
   * 勾选对比事件
   */
  isContrastChange() {
    const { rangePicker, isContrast } = this.validateForm.value;
    if (isContrast && rangePicker && rangePicker.length) {
      const day = 24 * 3600 * 1000;
      const [startTime, endTime] = rangePicker;
      const diffTime = new Date(endTime).getTime() - new Date(startTime).getTime() + day;
      const contrastEndTime = new Date(startTime).getTime();
      const contrastStartTime = contrastEndTime - diffTime;
      this.validateForm.patchValue({ contrastEndTime: new Date(contrastEndTime) });
      this.validateForm.patchValue({ contrastStartTime: new Date(contrastStartTime) });
    } else {
      this.validateForm.patchValue({ contrastEndTime: null });
      this.validateForm.patchValue({ contrastStartTime: null });
    }
  }


  flowDataTypeChange(flowDataType) {
    this.flowcommonform.flowDataType = flowDataType;
  }

  rangePickerChange() {
    this.isContrastChange();
  }




  contrastStartTimeDisabled(current: Date): boolean {
    const currentTime = new Date(current).getTime();
    const today = new Date().getTime();
    return currentTime - today > 0;
  }


  rangePickerDisabledDate(current: Date): boolean {
    const currentTime = new Date(current).getTime();
    const today = new Date().getTime();
    return currentTime - today > 0;
  }

  periodTypeChange(periodType = 'period_wid') {
    if (!this.isShowPurview) {
      const nowDate = new Date();
      const startTime = setDefaultDate(periodType, true);
      const rangePicker = periodType === 'period_wid' ? [startTime, startTime] : [startTime, nowDate];
      this.validateForm.get('rangePicker').patchValue(rangePicker);
      if (this.validateForm.get('isContrast').value === true) {
        this.isContrastChange();
      }
    } else {
      const { startTime, endTime } = setPurviewDefaultDate(periodType);
      this.validateForm.get('startTime').patchValue(startTime);
      this.validateForm.get('endTime').patchValue(endTime);
    }
  }


  disabledStartDate = (startTime: Date): boolean => {
    return startTime.getTime() > new Date().getTime();
  }

  disabledEndDate = (endTime: Date): boolean => {
    const periodType = this.validateForm.get('periodType').value;
    const startTime = this.validateForm.get('startTime').value;
    return this.commonCustomService.disabledTimeRange(startTime, endTime, periodType);
  }

  onStartChange(date: Date): void {
    const periodType = this.validateForm.get('periodType').value;
    const endTime = this.commonCustomService.setEndTime(date, periodType);
    this.validateForm.get('endTime').patchValue(endTime);
  }




  _setEndTime(num) {
    const nowTimeDate = new Date();
    const time = nowTimeDate.getTime();
    const dayTime = 24 * 3600 * 1000;
    const day = nowTimeDate.getDay() === 0 ? num : nowTimeDate.getDay();
    const endvalue = time - (day * dayTime) + dayTime;
    return endvalue;
  }

  /**
   * 设置最终选择的form数据
   */
  setSelectedData() {
    const paramsData: Object = {};
    paramsData['isSubmit'] = this.isSubmit;

    // 显示维度
    // if (this.isShowDimension) {
    //   paramsData['queryDimension'] = this.validateForm.value['queryDimension'];
    // }
    // 显示更多条件

    // const mergeParams = Object.assign({}, this.validateForm.value, this.checkAllData);
    const mergeParams = Object.assign({}, this.validateForm.value);

    Object.keys(mergeParams).forEach((value) => {
      if (this.isShowRegistCity && value === 'menAreaCode') {   // 城市名称
        paramsData[value] = mergeParams[value];
      }
      if (this.isShowContrast) {
        if ((value === 'contrastStartTime') || (value === 'contrastEndTime') || value === 'isContrast') {
          paramsData[value] = mergeParams[value];
        }
      }
      if (this.isShowDimension && value === 'queryDimension') {    // 维度
        paramsData[value] = mergeParams[value];
      }
      // if (this.isShowMore) {
      // if (value === 'deptId1' || value === 'deptId2' || value === 'userId'
      //   || value === 'accountUid' || value === 'siteNumber'
      //   || value === 'siteNumbers' || value === 'webUid' || value === 'code'
      //   || value === 'cityName' || value === 'advertisersType' || value === 'carrier'
      //   || value === 'source') {
      //   paramsData[value] = mergeParams[value];
      // }

      // 推广来源 推广方式 是全部就删除
      if ((value === 'advertisersType' || value === 'source') && mergeParams[value] === '全部') {
        delete mergeParams[value];
      }
      if (value === 'accountUids' || value === 'siteNumbers') {
        const newItem = mergeParams[value].map(item => {
          return item.split(',');
        });
        paramsData[value] = newItem;
      }
      // }
      // if ((value === 'flowDataType') || value === 'flConsultingProject' || value === 'periodType' || value === 'rangePicker') {
      //   paramsData[value] = mergeParams[value];
      // }
      paramsData[value] = mergeParams[value];
    });
    this.flowcommonform.formData = paramsData;
    return paramsData;
  }

  /**
   * 更多条件
   */
  handleShowMore(): void {
    this.isShowMore = !this.isShowMore;
  }



  // openQuerySourceNameChange(isOpen: boolean) {
  //   if (isOpen && !this.sourceOptions.length) {
  //     this.getQuerySourceName();
  //   }
  // }


  // menAreaCodeValChange(val) {
  //   this.menAreaCode = val;
  // }


  /**
  * 推广站点变动事件
  * @param siteNumber Array 推广站点
  */
  // siteNumberChange(siteNumber) {
  //   if (siteNumber && siteNumber.length) {
  //     this.siteNumberDisabled = false;
  //     this.siteNumberPackageDisabled = true;
  //   } else {
  //     this.siteNumberPackageDisabled = false;
  //   }
  // }

  /**
   * 获取推广来源
   */
  // getQuerySourceName(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getQuerySourceName$'] = this.flowcommonform.getQuerySourceName({ searchVal }).subscribe(result => {
  //     this.flowcommonform.sourceOptions = this.sourceOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }

  /**
   * 获取推广账户包
   */
  // getQueryAccountPackage() {
  //   this.subscribeAll$['getQueryAccountPackage$'] = this.flowcommonform.getQueryAccountPackage().subscribe(result => {
  //     this.accountUidsOptions = result.result;
  //   });
  // }

  /**
   * 获取推广站点包
   */
  // getQuerySitePackage() {
  //   this.subscribeAll$['getQuerySitePackage$'] = this.flowcommonform.getQuerySitePackage().subscribe(result => {
  //     this.siteNumbersOptions = result.result;
  //   });
  // }


  // openCityNameChange(isOpen: boolean) {
  //   if (isOpen && !this.cityNameOptions.length) {
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






  /**
   * 推广账户下拉列表变化
   */
  // queryAccountChange(isOpen: boolean) {
  //   if (isOpen) {
  //     this.getQueryAccount();
  //   }
  // }
  /**
   * 获取推广账户下拉列表
   */
  // getQueryAccount(searchVal: String = '') {
  //   this.optionsLoading = true;
  //   const params = { userId: this.validateForm.get('userId').value, searchVal };
  //   this.subscribeAll$['getQueryAccount$'] = this.flowcommonform.getQueryAccount(params).subscribe(result => {
  //     this.accountUidOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }


  /**
   * 打开推广项目下拉选项
   */
  // flConsultingProjectChange(isOpen: boolean) {
  //   if (isOpen && !this.flConsultingProjectOptions.length) {
  //     this.getFlConsultingProjectOptions();
  //   }
  // }

  /**
   * 获取推广项目列表
   */
  // getFlConsultingProjectOptions(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getFlConsultingProjectOptions$'] = this.flowcommonform.getFlConsultingProjectOptions({ searchVal })
  //     .subscribe(result => {
  //       this.flowcommonform.flConsultingProjectOptions = this.flConsultingProjectOptions = result.result;
  //       this.optionsLoading = false;
  //     });
  // }


  // openCodeChange(isOpen) {
  //   if (isOpen && !this.codeOptions.length) {
  //     this.getCodeOptions();
  //   }
  // }
  /**
   * 获取推广渠道
   */
  // getCodeOptions(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getCodeOptions$'] = this.flowcommonform.getCodeOptions({ searchVal }).subscribe(result => {
  //     this.flowcommonform.codeOptions = this.codeOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }

  /**
   * 打开推广站点下拉选项
   */
  // openSiteNumberChange(isOpen: boolean) {
  //   if (isOpen && !this.siteNumberOptions.length) {
  //     this.getSiteNumberOptions();
  //   }
  // }
  /**
   * 获取推广站点
   */
  // getSiteNumberOptions(searchVal: String = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getSiteNumberOptions$'] = this.flowcommonform.getSiteNumberOptions({ searchVal })
  //     .subscribe(result => {
  //       this.flowcommonform.siteNumberOptions = this.siteNumberOptions = result.result;
  //       this.optionsLoading = false;
  //     });
  // }

  /**
   * 打开报名城市下拉选项
   */
  // menAreaCodeChange(isOpen: boolean) {
  //   if (isOpen && !this.menAreaCodeOptions.length) {
  //     this.getMenAreaCodeOptions();
  //   }
  // }

  /**
   * 获取报名城市
   */
  // getMenAreaCodeOptions(searchVal: String = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getMenAreaCodeOptions$'] = this.flowcommonform.getMenAreaCodeOptions({ searchVal }).subscribe(result => {
  //     this.menAreaCodeOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }


  // openAdvertisersTypeChange(isOpen: boolean) {
  //   if (isOpen && !this.advertisersTypeOptions.length) {
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



  // openWebUidChange(isOpen: boolean) {
  //   if (isOpen && !this.webUidOptions.length) {
  //     this.getWebUidOptions();
  //   }
  // }
  /**
   * 获取主域名
   */
  // getWebUidOptions(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getWebUidOptions$'] = this.flowcommonform.getWebUidOptions({ searchVal }).subscribe(result => {
  //     this.flowcommonform.webUidOptions = this.webUidOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }

  /**
   * 获取流量军团下拉选项
   */
  // getDeptOptions() {
  //   this.subscribeAll$['getDeptOptions$'] = this.flowcommonform.getDeptOptions().subscribe(result => {
  //     this.deptId1Options = result.result;
  //   });
  // }



  // openGroupChange(isOpen) {
  //   if (isOpen) {
  //     this.getGroupOptions();
  //   }
  // }
  /**
   * 获取流量组下拉选项
   */
  // getGroupOptions(searchVal: string = '') {
  //   const params = { searchVal };
  //   const { deptId1 } = this.validateForm.value;
  //   if (deptId1 && deptId1.length) {
  //     params['dept'] = deptId1;
  //   }
  //   this.subscribeAll$['getGroupOptions$'] = this.flowcommonform.getGroupOptions(params).subscribe(result => {
  //     this.deptId2Options = result.result;
  //   });
  // }



  // openUserChange(isOpen) {
  //   if (isOpen) {
  //     this.getUserOptions();
  //   }
  // }

  /**
   * 获取流量人员下拉选项
   */
  // getUserOptions(searchVal: string = '') {
  //   const params = {searchVal};
  //   const { deptId1, deptId2 } = this.validateForm.value;
  //   if (deptId1 && deptId1.length) {
  //     params['dept'] = deptId1;
  //   }
  //   if (deptId2 && deptId2.length) {
  //     params['legion'] = deptId2;
  //   }
  //   this.subscribeAll$['getUserOptions$'] = this.flowcommonform.getUserOptions(params).subscribe(result => {
  //     this.userIdOptions = result.result;
  //   });
  // }

  // deptId1Change() {
  //   this.validateForm.patchValue({ deptId2: [], userId: [] });
  //   this.deptId2Options = [];
  //   this.userIdOptions = [];
  // }

  // deptId2Change() {
  //   this.validateForm.patchValue({ userId: [] });
  //   this.userIdOptions = [];
  // }



  /**
   * 获取流量人员下拉选项
   * @param parentId String 父ID 组织架构id
   */
  // getUserIdOptions(parentId) {
  //   this.subscribeAll$['getUserIdOptions$'] = this.flowcommonform.getUserIdOptions({ parentId: parentId }).subscribe(result => {
  //     this.userIdOptions = result.data;
  //   });
  // }


  /**
   * 流量组变动事件
   * @param values Array
   */
  // public onCascaderChanges(values: any): void {
  //   this.validateForm.patchValue({ userId: '' });
  //   this.depOptions = [];
  //   // 在线咨询师
  //   if (!values.length) {
  //     this.userIdOptions = [];
  //   } else {
  //     // 根据部门UID查询用户信息
  //     this.getUserIdOptions(values[values.length - 1]);
  //   }
  // }







  ngOnDestroy() {
    this.loading = this.flowcommonform.loading = false;
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
