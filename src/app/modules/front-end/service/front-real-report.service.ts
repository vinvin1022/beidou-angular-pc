import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class FrontRealReportService {
  public serviceName = 'dms';
  public loading: Boolean = false;
  public formatTime = ['calLongTime', 'rate8', 'rate9'];
  public plusPercentage = ['orderRate1', 'effRate1', 'firstCaRate'];
  constructor(private requestHttp: RequestService) { }




  /**
   * 前端实时查询
   * @param url string 请求地址
   * @param params object 请求参数
   */
  queryFrontACT(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/front/act/queryFrontACT`, params);
  }


  /**
  *  前端实时导出
  * @param params Object  请求参数
  */
  exportFrontACT(params = {}) {
    return this.requestHttp.exportExcel('dms/excelExport/exportFrontACT', params);
  }

  /**
  *  保存导出前端实时报表参数
  * @param params Object  请求参数
  */
  savefrontACTQueryVO(params = {}) {
    return this.requestHttp.post('dms/excelExport/savefrontACTQueryVO', params);
  }
}
