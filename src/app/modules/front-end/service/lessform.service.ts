import { Injectable } from '@angular/core';
import { setDefaultDate } from '../../../tools';

@Injectable({
  providedIn: 'root'
})
export class LessformService {
  public loading: Boolean = false;
  public NOWTIME = [setDefaultDate('period_wid', true), setDefaultDate('period_wid', true)];
  public defalutData = {
    business: null,  // 事业部
    deptId1: null,   // 军团
    deptId2: null,  // 咨询组
    userId: null,   // 咨询师
    periodType: 'period_wid',  // 时间类型
    rangePicker: this.NOWTIME,  // 时间范围
  };
  public parameters: Object = this.defalutData;
  constructor() { }
}
