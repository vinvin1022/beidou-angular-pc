import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class TasksDuringServiceService {
  public serviceName = 'dms';
  public loading = false;
  public plusPercentage = ['snRate1', 'snRate2', 'snRate3', 'snRate4', 'snRate5'];
  constructor(private requestHttp: RequestService) { }




  /**
   * 服务任务统计报表
   */
  queryServiceTasks(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/queryServiceTasks`, params);
  }




  /**
   * 服务期任务统计报表导出
   * @param params 请求参数
   */
  exportServiceTasks(params = {}) {
    return this.requestHttp.exportExcel(`${this.serviceName}/excelExport/exportServiceTasks`, params);
  }





}
