import { Component, OnInit, Output, EventEmitter, DoCheck, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { formatDate, rangePickerDisabledDate } from '../../../../tools';
import { SettingCenterService } from '../../service/setting-center.service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { DailyReportsService } from 'src/app/service/daily-reports.service';

@Component({
  selector: 'app-setting-center',
  templateUrl: './setting-center.component.html',
  styleUrls: ['./setting-center.component.scss']
})
export class SettingCenterComponent implements OnInit, DoCheck {
  @Output() sendQueryData = new EventEmitter();

  public channelNoOptions: Array<Object> = [];

  public validateForm: FormGroup;
  public loading: Boolean = false;
  public optionsLoading: Boolean = false;
  public interval;
  public rangePickerDisabledDate: Function = rangePickerDisabledDate;

  constructor(private fb: FormBuilder, private nzMessage: NzMessageService, private dailyReportsService: DailyReportsService,
    private settingCenterService: SettingCenterService, private notification: NzNotificationService) {
  }


  openConditionsChange() {
    if (!this.channelNoOptions.length) {
      this.selectChannelByConditions();
    }
  }
  // 推广渠道
  selectChannelByConditions(): void {
    this.optionsLoading = true;
    this.settingCenterService.selectChannelByConditions().subscribe(res => {
      this.optionsLoading = false;
      this.channelNoOptions = res.data.map(item => {
        item['value'] = item && item.channelNo;
        item['label'] = item && item.channelName;
        return item;
      });
    });
  }


  ngOnInit(): void {
    const channelNoList = this.settingCenterService.defaultFormData['channelNoList'];
    const rangePicker = this.settingCenterService.defaultFormData['rangePicker'];
    this.validateForm = this.fb.group({
      channelNoList: [channelNoList], // 推广渠道
      rangePicker: [rangePicker] // 推广日期
    });
  }

  ngDoCheck() {
    if (this.loading !== this.dailyReportsService.loading) {
      this.loading = this.dailyReportsService.loading;
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
    const formValue = this.validateForm.value;
    formValue['startDate'] = formatDate(formValue['rangePicker'][0], 'yyyy-MM-dd');
    formValue['endDate'] = formatDate(formValue['rangePicker'][1], 'yyyy-MM-dd');
    this.settingCenterService.getDailyReports(formValue).subscribe(res => {
      if (res.code === 200) {
        this.getSyncResult(res['data']);
      }
    });
  }
  getSyncResult(data: string) {
    const messageId = this.nzMessage.loading('正在同步数据...', { nzDuration: 0 }).messageId;
    this.dailyReportsService.loading = true;
    const params = { 'syncNum': data };
    this.settingCenterService.getSyncResult(params).subscribe(res => {
      if (res['code'] === 200) {
        this.nzMessage.remove(messageId);
        this.createNotification('info', res['data'].join(','));
        this.dailyReportsService.loading = false;
      } else {
        this.repeaterSyncResult(messageId, params);
      }
    });
  }
  repeaterSyncResult (messageId, params) {
    this.interval = setInterval(() => {
      this.settingCenterService.getSyncResult(params).subscribe(res => {
        if (res['code'] === 200) {
          this.nzMessage.remove(messageId);
          this.createNotification('info', res['data'].join(','));
          clearInterval(this.interval);
          this.dailyReportsService.loading = false;
        }
      });
    }, 1000 * 60);
  }
  createNotification(type: string, message: string): void {
    this.notification.create(type, '同步数据', message, { nzDuration: 0 });
  }

}
