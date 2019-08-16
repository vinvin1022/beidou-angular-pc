import { Injectable, EventEmitter } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setPurviewDefaultDate } from 'src/app/tools';


@Injectable({
  providedIn: 'root'
})
export class OnlineStatisticsService {
  public plusPercentage = ['rateX', 'rate1', 'rate2', 'rate3', 'rate4', 'rate5'];
  public loading = false;
  // tslint:disable-next-line:no-inferrable-types
  public flowDataType: string = '1';
  public defaultFormData = {
    dept: null,  // 在线部门
    userId: null, // 咨询师
    periodType: 'period_wid',
    cityName: null,  // 推广城市
    advertisersType: null, // 推广方式
    flowDataType: '1', // 业务模式
    consultingProject: null, // 推广项目
    code: null, // 推广渠道
    carrier: null, // 载体
    startTime: null,
    endTime: null
  };

  constructor(private requestHttp: RequestService) {
    const { startTime, endTime } = setPurviewDefaultDate();
    this.defaultFormData['startTime'] = startTime;
    this.defaultFormData['endTime'] = endTime;
  }


  /**
   * 获取统计接口
   *
   * @param params object  请求参数
   */
  getStatistics(url: string = 'dms/view/groupDeptOnline', params: object = {}) {
    return this.requestHttp.post(url, params);
  }

  /**
   * 获取详细接口
   *
   * @param params object  请求参数
   */
  getDetail(url: string = 'dms/view/detailDeptOnline', params: object = {}) {
    return this.requestHttp.post(url, params);
  }


  /**
   * 在线统计接口
   *
   * @param params object  请求参数
   */
  getOnline(params: object = {}) {
    return this.requestHttp.post('dms/view/online', params);
  }
  /**
   * 在线统计导出
   * @param params object  请求参数
   */
  exportOnline(params: object = {}) {
    return this.requestHttp.exportExcel('dms/flowExport/exportOnline', params);
  }


  /**
   * 获取在线部门
   * @param params object  请求参数
   */
  getOnlineDept(params: object = {}) {
    return this.requestHttp.post('dms/userDept/onlineDept', params);
  }

  /**
   * 获取在线用户
   * @param params object  请求参数
   */
  getOnlineUser(params: object = {}) {
    return this.requestHttp.post('dms/userDept/onlineUser', params);
  }
}
