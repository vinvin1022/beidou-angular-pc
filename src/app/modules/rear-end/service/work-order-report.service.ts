import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class WorkOrderReportService {
  public serviceName = 'dms';
  public loading: Boolean = false;
  public plusPercentage = ['rate1'];
  constructor(private requestHttp: RequestService) { }

  /**
   * 查询每日工单报表
   * @param url string 请求地址
   * @param params object 请求参数
   */
  queryAfterSale(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/queryAfterSale`, params);
  }

  /**
 * 查询每日工单饼图
 * @param url string 请求地址
 * @param params object 请求参数
 */
  queryBigTypeNum(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/queryBigTypeNum`, params);
  }

  /**
 * 查询每日工单柱状图
 * @param url string 请求地址
 * @param params object 请求参数
 */
  querySmallTypeNum(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/querySmallTypeNum`, params);
  }



  /**
  *  每日工单导出
  * @param params Object  请求参数
  */
  exportDailyWorkOrders(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportDailyWorkOrders`, params);
  }



}
