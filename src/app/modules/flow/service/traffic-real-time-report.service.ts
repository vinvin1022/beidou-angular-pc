import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class TrafficRealTimeReportService {
  public loading = false;
  public serviceName = 'dms';
  public plusPercentage = ['rate1', 'rate2', 'rate3', 'rate4', 'acRate'];
  constructor(private requestHttp: RequestService) { }



  /**
   * 查询实时列表
   * @param params object  请求参数
   */
  getQueryFlowRealTime(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/flowAct/realtime/queryFlowRealTime`, params);
  }

}
