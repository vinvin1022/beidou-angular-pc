import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { DailyHoursService } from '../../../service/dailyHours.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-set-meet-standard',
  templateUrl: './set-meet-standard.component.html',
  styleUrls: ['./set-meet-standard.component.scss']
})
export class SetMeetStandardComponent implements OnInit {
  @Input() title = '设置通时达标值';
  @Output() setupSuccess = new EventEmitter();
  public subscribeAll$: object = {};
  public isVisible = false;

  public dailyTimeParams: Array<object> = [
    {
      timePoint: '0-12',
      numberCalls: 5,
      outgoingCall: 32,
      averageCall: 1000
    },
    {
      timePoint: '12-14',
      numberCalls: 10,
      outgoingCall: 32,
      averageCall: 200
    },
    {
      timePoint: '14-17',
      numberCalls: 20,
      outgoingCall: 32,
      averageCall: 1500
    },
    {
      timePoint: '17-19',
      numberCalls: 15,
      outgoingCall: 32,
      averageCall: 1200
    },
    {
      timePoint: '19-21',
      numberCalls: 18,
      outgoingCall: 32,
      averageCall: 800
    },
    {
      timePoint: '21-24',
      numberCalls: 12,
      outgoingCall: 32,
      averageCall: 650
    }
  ];

  constructor(private dailyHoursService: DailyHoursService, private nzMessage: NzMessageService) { }

  ngOnInit() { }
  handleOk(): void {
    this.addDailyTime();
  }

  /**
   * 获取通时达标值
   */
  getCommonDailyTime() {
    this.subscribeAll$['getCommonDailyTime$'] = this.dailyHoursService.getCommonDailyTime().subscribe(res => {
      this.dailyTimeParams = res.result;
    });
  }

  addDailyTime() {
    const dmDailyTime = { dmDailyTime: JSON.stringify(this.dailyTimeParams) };
    this.dailyHoursService.addDailyTime(dmDailyTime).subscribe(res => {
      this.nzMessage.success('设置通时达标值成功');
      this.setupSuccess.emit();
      this.handleCancel();
    });
  }

  handleCancel(isShow = false): void {
    this.isVisible = isShow;
    if (this.isVisible) {
      this.getCommonDailyTime();
    }
  }
}
