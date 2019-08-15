import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class EmployedPerformanceService {

  constructor(private requestHttp: RequestService) { }
  /**
   *  自营业绩统计接口
   * @param params Object  请求参数
   */
  getSelfPerformance(params = {}) {
    return this.requestHttp.post('dms/middler/selfPerformance', params);
  }


  /**
 *  自营业绩导出
 * @param params Object  请求参数
 */
exportSelfPerformance(params = {}) {
  // return this.requestHttp.exportExcel('dms/flowExport/exportSelfPerformance', params);
  return this.requestHttp.exportExcel('dms/excelExport/exportSelfPerformance', params);
}



}
