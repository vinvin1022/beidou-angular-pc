import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';


@Injectable({
  providedIn: 'root'
})
export class SettingCenterService {
  public day = setDefaultDate('period_wid', true);
  public defaultFormData: object = {
    channelNoList: [], // 推广渠道
    rangePicker: [this.day, this.day] // 推广日期
  };

  constructor(private requestHttp: RequestService) { }

  /**
   * 获取同步数据结果
   *
   * @param params object  请求参数
   */
  getSyncResult(params: object = {}) {
    return this.requestHttp.post('ftms-channel/report/getSyncResult', params);
  }
  /**
   * 同步日报表数据
   * @param params object  请求参数
   */
  getDailyReports(params: object = {}) {
    return this.requestHttp.post('ftms-channel/report/getDailyReports', params);
  }

  /**
   * 根据条件查询渠道信息
   * @param params object  请求参数
   */
  selectChannelByConditions(params: object = {}) {
    return this.requestHttp.post('ftms-channel/channel/selectChannelByConditions', params);
  }



}

