import { Injectable } from '@angular/core';
import { setDefaultDate } from 'src/app/tools';

@Injectable({
  providedIn: 'root'
})
export class MoreformService {
  public loading = false;
  public NOWTIME = [setDefaultDate('period_wid', true), setDefaultDate('period_wid', true)];


  public defalutData = {
    business: null,  // 事业部
    deptId1: null,   // 军团
    deptId2: null,  // 咨询组
    userId: null,   // 咨询师
    code: null,  // 推广渠道
    cityName: null,  // 推广城市
    advertisersType: '全部',   // 推广方式
    accountUid: null,   // 推广人
    source: '全部',  // 推广来源
    rangePicker: this.NOWTIME,  // 时间范围
    groupDimension: 'code',
  };

  public groupDimensionOptions: Array<object> = [
    { key: 'code', value: '推广渠道' },
    { key: 'promoter_name', value: '推广人' },
    { key: 'advertisers_type', value: '推广方式' },
    { key: 'city_name', value: '推广城市' }
  ];
  constructor() { }

}
