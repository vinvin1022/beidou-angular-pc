import { Component, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { formatDate, rangePickerDisabledDate, setPurviewDefaultDate } from '../../../../../tools';
import { OnlineStatisticsService } from '../../../service/online-statistics.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';



@Component({
  selector: 'app-subonline-paration',
  templateUrl: './subonline-paration.component.html',
  styleUrls: ['./subonline-paration.component.scss']
})
export class SubonlineParationComponent implements OnInit, DoCheck {
  @Output() sentSearchData = new EventEmitter();
  public departmentOptions: Array<object> = [];
  public userId: Array<object>;
  public cityNameOptions: Array<object> = [];
  public popularizationModeOptions: Array<object> = [];
  public rangePickerDisabledDate: (current: Date) => void = rangePickerDisabledDate;

  public flowDataTypeOptions: Array<object> = [];
  public consultingProjectOptions: Array<object> = [];
  public codeOptions: Array<object> = [];
  public carrier: Array<object> = [];

  public validateForm: FormGroup;
  public showTimePicker = false;

  public startTime: Date = null;
  public endTime: Date = null;
  public loading = false;
  public optionsLoading = false;
  public onlineDeptOptions: Array<any> = [];
  public onlineUserOptions: Array<any> = [];
  public allonlineDeptOptions: Array<any> = [];


  public paramsAll = {};




  constructor(private fb: FormBuilder, public flowcommonform: FlowcommonformService,
    public onlineStatisticsService: OnlineStatisticsService, private commonCustomService: CommonCustomService) {
  }

  ngOnInit(): void {

    this.flowDataTypeOptions = this.flowcommonform.flowDataTypeOptions;
    this.carrier = this.flowcommonform.carrierOptions;
    this.initForm();

    this.submitForm();
    // this.getFlConsultingProjectOptions();
    // this.allgetOnlineDept();
  }

  initForm() {
    const { dept, userId, periodType, cityName, advertisersType, flowDataType, consultingProject, code,
      carrier, startTime, endTime } = this.onlineStatisticsService.defaultFormData;
    this.validateForm = this.fb.group({
      dept: [dept],  // 在线部门
      userId: [userId], // 咨询师
      cityName: [cityName],  // 推广城市
      advertisersType: [advertisersType], // 推广方式
      flowDataType: [flowDataType], // 业务模式
      consultingProject: [consultingProject], // 推广项目
      code: [code], // 推广渠道
      carrier: [carrier], // 载体
      periodType: [periodType],
      startTime: [startTime],
      endTime: [endTime]
    });
  }

  private _setAssociationParams() {
    const keys = ['dept'];
    for (const key in this.validateForm.value) {
      if (this.validateForm.value.hasOwnProperty(key)) {
        const element = this.validateForm.value[key];
        if (keys.includes(key) && element) {
          this.paramsAll[key] = element;
        }
      }
    }
  }

  allonlineDeptChange(val) {
    this.validateForm.get('userId').patchValue([]);
    this._setAssociationParams();
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



  onEndChange(date: Date): void {
    this.endTime = date;
  }


  flowDataTypeChange(flowDataType) {
    this.onlineStatisticsService.flowDataType = flowDataType;
    // this.onlineStatisticsService.flowDataType = this.formateFlowDataType(flowDataType)['optionName'];
  }

  formateFlowDataType(flowDataType: string) {
    return this.flowDataTypeOptions.find((item) => flowDataType === item['optionId']);
  }


  periodTypeChange(periodType = 'period_wid') {
    const { startTime, endTime } = setPurviewDefaultDate(periodType);
    this.validateForm.get('startTime').patchValue(startTime);
    this.validateForm.get('endTime').patchValue(endTime);
  }

  ngDoCheck() {
    if (this.loading !== this.onlineStatisticsService.loading) {
      this.loading = this.onlineStatisticsService.loading;
    }
  }
  // 提交表单
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const formValue = Object.assign({}, this.validateForm.value);
    if (formValue.advertisersType === '全部') {
      delete formValue.advertisersType;
    }
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        const element = formValue[key];
        if ((Array.isArray(element) && !element.length) || !element) {
          delete formValue[key];
        }
        if ((key === 'startTime' || key === 'endTime') && formValue[key]) {
          formValue[key] = formatDate(formValue[key], 'yyyy-MM-dd');
        }
      }
    }
    // this.eventBusService.sendMessage(formValue);
    this.sentSearchData.emit(formValue);
  }
  // 重置表单
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset(this.onlineStatisticsService.defaultFormData);
  }
}
