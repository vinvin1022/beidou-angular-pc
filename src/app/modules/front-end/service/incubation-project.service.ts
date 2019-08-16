import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class IncubationProjectService {
  public loading = false;
  public periodType = 'period_wid';
  public periodWidColumn;
  public weekInyearColumn;

  // public formatTime = ['calLongTime', 'firstTimediffAlCal', 'timediffAlFl'];

  public plusPercentage = ['rate2', 'rate0', 'rate1', 'rate3', 'rate4', 'rate5', 'rate6', 'rate11', 'rate12', 'rate19', 'rate20'];


  constructor(private requestHttp: RequestService) { }



  /**
   * 查询MDC列表
   * @param params DayGroupDivisionParams  请求参数
   */
  queryMDCView(params = {}) {
    const url = 'dms/mdc/manager/queryMDCView';
    return this.requestHttp.post(url, params);
  }




  /**
   * 研究生孵化项目导出
   * @param params 請求參數
   */
  exportMDC(params = {}) {
    return this.requestHttp.exportExcel('dms/excelExport/exportMDC', params);

  }

}
