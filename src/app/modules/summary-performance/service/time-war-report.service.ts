import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class TimeWarReportService {
  public loading = false;
  public serviceName = 'dms';
  public plusPercentage = ['rateM', 'rateD'];
  constructor(private requestHttp: RequestService) { }

  /**
   * 查询战报信息
   * @param params object  请求参数
   */
  queryWarNews(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/war/news/queryWarNews`, params);
  }

  /**
   * 战报导出
   * @param params object  请求参数
   */
  exportWarNews(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportWarNews`, params);
  }
}
