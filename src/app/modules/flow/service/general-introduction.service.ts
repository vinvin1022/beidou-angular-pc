import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralIntroductionService {
  public plusPercentage = ['rate1', 'rate2', 'rate3', 'rate6', 'rate7', 'rate8', 'rate9', 'rate12', 'rate13', 'rate14', 'rate15', 'rate16',
        'rate17', 'onlineClick', 'effClick', 'effClickCon', 'effordersAco', 'effordersAco14', 'effordersAco15', 'effordersAco7',
        'meseffordersAco', 'onleffordersAco', 'ctr', 'rate19'];
  constructor(private requestHttp: RequestService) { }

  /**
   * 推广总览汇总统计接口
   * @param url String   请求地址
   * @param params Object  请求参数
   */
  reportSummary(params = {}) {
    return this.requestHttp.post('dms/view/reportSummary', params);
  }


  /**
   * 推广总览维度统计接口
   * @param url String   请求地址
   * @param params Object  请求参数
   */
  flowViewReport(params = {}) {
    return this.requestHttp.post('dms/view/report', params);
  }


  /**
   *  推广总览详细--维度详细统计
   * @param url String   请求地址
   * @param params Object  请求参数
   */
  reportDimension(params = {}) {
    return this.requestHttp.post('dms/view/reportDimension', params);
  }

  /**
   * 推广总览导出
   * @param url String   请求地址
   * @param params Object  请求参数
   */
  generalIntroductionExportView(params = {}) {
    // return this.requestHttp.get('dms/flowExport/exportView', params);
    return this.requestHttp.exportExcel('dms/flowExport/exportView', params);
  }
}
