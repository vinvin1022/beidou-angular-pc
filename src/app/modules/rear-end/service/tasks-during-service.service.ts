import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class TasksDuringServiceService {
  public serviceName = 'dms';
  public loading: Boolean = false;
  public plusPercentage = ['snRate1', 'snRate2', 'snRate3', 'snRate4', 'snRate5'];
  constructor(private requestHttp: RequestService) { }




  /**
   * 流水周期报表查询
   * @param url string 请求地址
   * @param params object 请求参数
   */
  queryDealCycle(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/deal/cycle/queryDealCycle`, params);
  }


  /**
  *  流水周期报表导出
  * @param params Object  请求参数
  */
  exportDealCycle(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportDealCycle`, params);
  }



  /**
  *  保存导出流水周期报表参数
  * @param params Object  请求参数
  */
  saveDealCycleQueryVO(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/excelExport/saveDealCycleQueryVO`, params);
  }


}
