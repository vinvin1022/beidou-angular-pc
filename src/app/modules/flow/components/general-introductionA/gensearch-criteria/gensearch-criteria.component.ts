import {
  Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, OnDestroy, DoCheck,
  TemplateRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { GensearchCriteriaService } from '../../../service/gensearch-criteria.service';
import { setDefaultDate, setPurviewDefaultDate } from 'src/app/tools';
import { NzMessageService } from 'ng-zorro-antd';

interface CheckedDimension {
  value: string;
  label: string;
  disabled: boolean;
  checked: boolean;
}

@Component({
  selector: 'app-gensearch-criteria',
  templateUrl: './gensearch-criteria.component.html',
  styleUrls: ['./gensearch-criteria.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GensearchCriteriaComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('formtitle', { static: false }) formtitle: TemplateRef<any>;

  // 是否显示条件
  public isShowMore: Boolean = this.gensearchCriteriaService.isShowMore;
  // 查询包管理权限控制
  @Input() packagePermissions: String = 'b030102';
  // 是否显示报名城市
  @Input() isShowRegistCity: Boolean = this.gensearchCriteriaService.isShowRegistCity;
  // 是否显示维度
  @Input() isShowDimension: Boolean = this.gensearchCriteriaService.isShowDimension;
  // 是否显示对比时间
  @Input() isShowContrast: Boolean = this.gensearchCriteriaService.isShowContrast;
  // 是否显示年条件
  @Input() isShowYear: Boolean = this.gensearchCriteriaService.isShowYear;
  // 是否显示查询包管理
  @Input() isShowMyQueryPacket: Boolean = true;

  @Input() isShowMenAreaName: Boolean = true;
  // 是否显示时间范围
  @Input() isShowPurview: Boolean = false;
  // 我的查询包url
  @Input() queryPacketUrl: String = '/flow/genQueryPacket';

  @Output() sendQueryData = new EventEmitter<any>();
  public flowDataTypeOptions = []; // 业务模式
  public carrierOptions: Array<Object> = [];   // 载体
  public size = 'defalut';

  public queryDimensionOptions: Array<Object> = [];   // 维度
  public isSubmit: Boolean = true;
  public subscribeAll$ = {}; // 订阅的所有事件
  public validateForm: FormGroup;
  public accountUidDisabled: Boolean = false;   // 是否禁用推广账户选项
  public siteNumberDisabled: Boolean = false;   // 是否禁用推广站点选项
  public accountUidPackageDisabled: Boolean = false;   // 是否禁用推广账户选项
  public siteNumberPackageDisabled: Boolean = false;   // 是否禁用推广站点选项
  public loading: Boolean = false;
  public selectDimensions: Array<object> = [];
  public sort = 0;

  public checkAllData = {};
  public paramsAll = {};




  constructor(private fb: FormBuilder, public gensearchCriteriaService: GensearchCriteriaService,
    private commonCustomService: CommonCustomService, private message: NzMessageService) { }

  /**
   * 重置数据
   * @param e MouseEvent
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.isSubmit = false;
    this.validateForm.reset(this.gensearchCriteriaService.defaultFormData);
    this._setCheckAll();
    this.markAsPristineFrom();
  }


  /**
  * 提交数据
  */
  submitForm(): boolean {
    this.isSubmit = true;
    this.markAsPristineFrom();
    const formData = this.setSelectedData();
    if (!formData['selectDimensions'].length) {
      this.message.error('维度必选');
      return false;
    }
    // this.isShowMore = false;
    this.sendQueryData.emit({ ...formData });
    return true;
  }


  ngOnInit(): void {
    this.flowDataTypeOptions = this.gensearchCriteriaService.flowDataTypeOptions; // 业务模式
    this.carrierOptions = this.gensearchCriteriaService.carrierOptions;   // 载体
    this._setCheckAll();
    this.initForm();
    this.filterQueryDimensionOptions();
    this.periodTypeChange();

  }

  ngDoCheck() {
    if (this.loading !== this.gensearchCriteriaService.loading) {
      this.loading = this.gensearchCriteriaService.loading;
    }
  }

  /**
   * 过滤报名城市
   */
  filterQueryDimensionOptions() {
    if (!this.isShowMenAreaName) {
      this.queryDimensionOptions = this.gensearchCriteriaService.queryDimensionOptions.filter(item => item['key'] !== 'men_area_name');
    } else {
      this.queryDimensionOptions = this.gensearchCriteriaService.queryDimensionOptions;
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
    const { menAreaCode, flowDataType, flConsultingProject, divisionId, deptId1, deptId2, userId, accountUid, siteNumber, accountUids,
      siteNumbers, webUid, code, cityName, carrier, advertisersType, source, periodType, rangePicker, contrastRangePicker,
      isContrast, contrastStartTime, contrastEndTime, startTime, endTime } = this.gensearchCriteriaService.defaultFormData;
    this.validateForm = this.fb.group({
      menAreaCode: [menAreaCode],   // 报名城市
      flowDataType: [flowDataType],  // 业务模式
      flConsultingProject: [flConsultingProject],  // 推广项目
      divisionId: [divisionId], // 事业部
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
      isContrast: [isContrast],  // 是否对比
      contrastStartTime: [contrastStartTime],
      contrastEndTime: [contrastEndTime],
      startTime: [startTime],
      endTime: [endTime]
    });
  }

  private _setCheckAll() {
    const queryDimension: Array<CheckedDimension> = [
      { value: 'men_area_name', label: '报名城市', disabled: false, checked: false },
      { value: 'fl_consulting_project', label: '推广项目', disabled: false, checked: true },
      { value: 'flowin_depid', label: '事业部', disabled: false, checked: true },
      { value: 'dept_id_1', label: '流量军团', disabled: false, checked: false },
      { value: 'dept_id_2', label: '流量组', disabled: false, checked: false },
      { value: 'user_id', label: '流量人员', disabled: false, checked: false },
      { value: 'account_name', label: '推广账户', disabled: false, checked: false },
      { value: 'site_number', label: '推广站点', disabled: false, checked: false },
      { value: 'web_uid', label: '主域名', disabled: false, checked: false },
      { value: 'code', label: '推广渠道', disabled: false, checked: false },
      { value: 'city_name', label: '推广城市', disabled: false, checked: false },
      { value: 'advertisers_type', label: '推广方式', disabled: false, checked: false },
      { value: 'source', label: '推广来源', disabled: false, checked: false },
      { value: 'carrier', label: '载体', disabled: false, checked: false }
    ];
    const { menAreaCode, flowDataType, flConsultingProject, divisionId, deptId1, deptId2, userId, accountUid, siteNumber, accountUids,
      siteNumbers, webUid, code, cityName, carrier, advertisersType, source } = this.gensearchCriteriaService.defaultFormData;
    this.checkAllData = {
      // menAreaCode: menAreaCode,  // 报名城市
      // flowDataType: flowDataType, // 业务模式
      // flConsultingProject: flConsultingProject, // 推广项目
      // divisionId: divisionId, // 事业部
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
      // source: source, // 推广来源
      queryDimension: queryDimension    // 维度
    };

    this.selectDimensions = queryDimension.filter(item => item['checked']);
    this._addBadge();
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
    const { siteNumber } = this.gensearchCriteriaService.defaultFormData;
    this.validateForm.patchValue({
      siteNumber: siteNumber
    });
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
    const { accountUid, siteNumber } = this.gensearchCriteriaService.defaultFormData;
    this.validateForm.patchValue({
      accountUid: accountUid,
      siteNumber: siteNumber
    });
    this._setAssociationParams();
  }

  alldeptId1Change(val) {
    // this.checkAllData['deptId2'] = null;
    // this.checkAllData['userId'] = null;
    // this.checkAllData['accountUid'] = null;
    // this.checkAllData['siteNumber'] = null;
    const { deptId2, userId, accountUid, siteNumber } = this.gensearchCriteriaService.defaultFormData;
    this.validateForm.patchValue({
      deptId2: deptId2,
      userId: userId,
      accountUid: accountUid,
      siteNumber: siteNumber
    });
    this._setAssociationParams();
  }

  alldeptId2Change(val) {
    // this.checkAllData['userId'] = null;
    // this.checkAllData['accountUid'] = null;
    // this.checkAllData['siteNumber'] = null;
    const { userId, accountUid, siteNumber } = this.gensearchCriteriaService.defaultFormData;
    this.validateForm.patchValue({
      userId: userId,
      accountUid: accountUid,
      siteNumber: siteNumber
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
    const keys = ['divisionId', 'deptId1', 'deptId2', 'userId', 'accountUid'];
    this.paramsAll = {};
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



  queryDimensionChange(dimensions: Array<CheckedDimension>): void {
    const newDimensions = this.checkAllData['queryDimension'].filter(item => item['checked']);
    this.selectDimensions = this.selectDimensions.filter(item => item['checked']);

    newDimensions.forEach(pitem => {
      if (!this.selectDimensions.includes(pitem) && pitem['checked']) {
        this.selectDimensions.push(pitem);
      } else if (this.selectDimensions.includes(pitem) && !pitem['checked']) {
        const idex = this.selectDimensions.findIndex(sitem => sitem['value'] === pitem['value'] && !sitem['checked']);
        this.selectDimensions.splice(idex, 1);
      }
    });
    if (this.selectDimensions.length === 5) {
      this.checkAllData['queryDimension'].map(item => {
        if (!item['checked']) {
          item['disabled'] = true;
        }
        return item;
      });
    } else {
      this.checkAllData['queryDimension'].map(item => {
        item['disabled'] = false;
        return item;
      });
    }
    this._addBadge();
  }

  private _addBadge() {
    let num = 1;
    this.checkAllData['queryDimension'].map(sitem => {
      if (!sitem['checked']) {
        sitem['num'] = 0;
      }
      return sitem;
    });
    this.selectDimensions.forEach(pitem => {
      this.checkAllData['queryDimension'].map(sitem => {
        if (pitem['value'] === sitem['value'] && sitem['checked']) {
          sitem['num'] = num++;
        }
        return sitem;
      });
    });
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
    // this.gensearchCriteriaService.flowDataType = this.gensearchCriteriaService.formateFlowDataType(flowDataType)['optionName'];
    this.gensearchCriteriaService.flowDataType = flowDataType;
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
    const mergeParams = Object.assign({}, this.validateForm.value, this.checkAllData);
    Object.keys(mergeParams).forEach((value) => {
      if (this.isShowRegistCity && value === 'menAreaCode') {   // 城市名称
        paramsData[value] = mergeParams[value];
      } else if (this.isShowContrast) {
        if ((value === 'contrastStartTime') || (value === 'contrastEndTime') || value === 'isContrast') {
          paramsData[value] = mergeParams[value];
        }
      } else if (this.isShowDimension && value === 'queryDimension') {    // 维度
        paramsData['selectDimensions'] = [...this.selectDimensions];
      } else if ((value === 'advertisersType' || value === 'source') && mergeParams[value] === '全部') {
        delete mergeParams[value];
      } else {
        paramsData[value] = mergeParams[value];
      }
    });
    this.gensearchCriteriaService.formData = paramsData;
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
   * 获取推广来源
   */
  // getQuerySourceName(searchVal = '') {
  //   this.optionsLoading = true;
  //   this.subscribeAll$['getQuerySourceName$'] = this.gensearchCriteriaService.getQuerySourceName({ searchVal }).subscribe(result => {
  //     this.gensearchCriteriaService.sourceOptions = this.sourceOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }

  /**
   * 获取推广账户包
   */
  // getQueryAccountPackage() {
  //   this.subscribeAll$['getQueryAccountPackage$'] = this.gensearchCriteriaService.getQueryAccountPackage().subscribe(result => {
  //     this.accountUidsOptions = result.result;
  //   });
  // }

  /**
   * 获取推广站点包
   */
  // getQuerySitePackage() {
  //   this.subscribeAll$['getQuerySitePackage$'] = this.gensearchCriteriaService.getQuerySitePackage().subscribe(result => {
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
  //   this.subscribeAll$['getSpreadCitylist$'] = this.gensearchCriteriaService.getSpreadCitylist({ searchVal }).subscribe(result => {
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
  //   this.subscribeAll$['getQueryAccount$'] = this.gensearchCriteriaService.getQueryAccount(params).subscribe(result => {
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
  //   this.subscribeAll$['getFlConsultingProjectOptions$'] = this.gensearchCriteriaService.getFlConsultingProjectOptions({ searchVal })
  //     .subscribe(result => {
  //       this.gensearchCriteriaService.flConsultingProjectOptions = this.flConsultingProjectOptions = result.result;
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
  //   this.subscribeAll$['getCodeOptions$'] = this.gensearchCriteriaService.getCodeOptions({ searchVal }).subscribe(result => {
  //     this.gensearchCriteriaService.codeOptions = this.codeOptions = result.result;
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
  //   this.subscribeAll$['getSiteNumberOptions$'] = this.gensearchCriteriaService.getSiteNumberOptions({ searchVal })
  //     .subscribe(result => {
  //       this.gensearchCriteriaService.siteNumberOptions = this.siteNumberOptions = result.result;
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
  //   this.subscribeAll$['getMenAreaCodeOptions$'] = this.gensearchCriteriaService.getMenAreaCodeOptions({ searchVal }).subscribe(result => {
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
  //   this.subscribeAll$['getAdvertisersTypeOptions$'] = this.gensearchCriteriaService.getAdvertisersTypeOptions({ searchVal })
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
  //   this.subscribeAll$['getWebUidOptions$'] = this.gensearchCriteriaService.getWebUidOptions({ searchVal }).subscribe(result => {
  //     this.gensearchCriteriaService.webUidOptions = this.webUidOptions = result.result;
  //     this.optionsLoading = false;
  //   });
  // }

  /**
   * 获取流量军团下拉选项
   */
  // getDeptOptions() {
  //   this.subscribeAll$['getDeptOptions$'] = this.gensearchCriteriaService.getDeptOptions().subscribe(result => {
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
  //   this.subscribeAll$['getGroupOptions$'] = this.gensearchCriteriaService.getGroupOptions(params).subscribe(result => {
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
  //   this.subscribeAll$['getUserOptions$'] = this.gensearchCriteriaService.getUserOptions(params).subscribe(result => {
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
  //   this.subscribeAll$['getUserIdOptions$'] = this.gensearchCriteriaService.getUserIdOptions({ parentId: parentId }).subscribe(result => {
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
    this.loading = this.gensearchCriteriaService.loading = false;
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
