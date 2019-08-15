import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';

@Injectable({
  providedIn: 'root'
})
export class MiddleEndSearchFormService {
  public loading: Boolean = false;
  public startEndTime: Date = setDefaultDate('period_wid', true);
  public defalutData = {
    deptId: null,  // 军团
    groupId: null,   // 咨询组
    userId: null,   // 咨询师
    code: null,  // 推广渠道
    cityName: null,  // 推广城市
    accountUid: null,   // 推广人
    source: null,  // 推广来源
    periodType: 'period_wid',  // 时间类型
    rangePicker: [this.startEndTime, this.startEndTime]  // 时间范围
  };

  public timeTypes: Array<Object> = [
    { key: 'period_wid', value: '日' },
    { key: 'week_inyear', value: '周' },
    { key: 'period_month', value: '月' },
    { key: 'period_qtr', value: '季度' },
    { key: 'period_year', value: '年' }
  ];

  constructor(private requestHttp: RequestService) { }


  /**
 *  获取中端军团
 * @param params Object  请求参数
 */
  getMiddleLegion(params = {}) {
    return this.requestHttp.post('dms/userDept/middleLegion', params);
  }


  /**
 *  获取中端咨询组
 * @param params Object  请求参数
 */
  getMiddleGroup(params = {}) {
    return this.requestHttp.post('dms/userDept/middleGroup', params);
  }


  /**
 *  获取中端咨询师
 * @param params Object  请求参数
 */
  getMiddleUser(params = {}) {
    return this.requestHttp.post('dms/userDept/middleUser', params);
  }

}
