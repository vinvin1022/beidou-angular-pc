import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class TimeWarReportService {
  public loading: Boolean = false;
  public serviceName = 'dms';
  public plusPercentage = ['rateM', 'rateD'];
  constructor(private requestHttp: RequestService) { }

   /**
   * 查询战报信息
   * @param params Object  请求参数
   */
  queryWarNews(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/war/news/queryWarNews`, params);
  }

  /**
   * 战报导出
   * @param params Object  请求参数
   */
  exportWarNews(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportWarNews`, params);
  }
}
