import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class RearendRealTimeReportService {
  private serviceName = 'dms';
  constructor(private requestHttp: RequestService) { }
  /**
   *  每日通时实时
   * @param params object  请求参数
   */
  getQueryDaliyTimeACTVOs(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/daliyTime/act/queryDaliyTimeACTVOs`, params);
  }

  /**
   *  后端实时导出
   * @param params object  请求参数
   */
  exportDaliyTimeACTVOs(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportDaliyTimeACTVOs`, params);
  }
}

