import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class DailyReachRateService {
  public serviceName = 'dms';
  public loading = false;
  public plusPercentage = ['rate1', 'rate2', 'rate3', 'rate4'];
  constructor(private requestHttp: RequestService) { }




  /**
   * 查询每日触达率报表
   * @param params 請求參數
   */
  dailyReachRateQueryVO(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/dailyReachRateQueryVO`, params);
  }


  /**
   * 每日触达率导出
   * @param params 請求參數
   */
  exportBackdailyReachRate(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportBackdailyReachRate`, params);
  }
}
