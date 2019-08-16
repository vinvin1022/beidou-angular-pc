import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';


@Injectable({
  providedIn: 'root'
})
export class ExpansionDerivationService {
  public day = new Date();
  public loading = false;
  public defaultFormData: object = {
    channelNoList: [], // 推广渠道
    rangePicker: [this.day, this.day] // 推广日期
  };

  constructor(private requestHttp: RequestService) { }

  /**
   * 在线统计接口
   *
   * @param params object  请求参数
   */
  getConditions(params: object = {}) {
    return this.requestHttp.post('ftms-channel/report/selectByConditions', params);
  }
  /**
   * 推广计划日报表数据导出
   * @param params object  请求参数
   */
  exportSpreadPlanExport(params: object = {}) {
    return this.requestHttp.exportExcel('ftms-channel/report/spreadPlanExport', params);
  }
  /**
   * 根据条件查询渠道信息
   * @param params object  请求参数
   */
  selectChannelByConditions(params: object = {}) {
    return this.requestHttp.post('ftms-channel/channel/selectChannelByConditions', params);
  }


}

