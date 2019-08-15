import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class DailyHoursService {

  constructor(private requestHttp: RequestService) { }
  /**
   *  每日通时统计接口
   * @param params Object  请求参数
   */
  getDailyTime(params = {}) {
    return this.requestHttp.post('dms/middler/dailyTime', params);
  }


  /**
   *  保存每日通时设置
   * @param params Object  请求参数
   */
  addDailyTime(params = {}) {
    return this.requestHttp.post('dms/common/addDailyTime', params);
  }

  /**
   *  获取每日通时设置
   * @param params Object  请求参数
   */
  getCommonDailyTime(params = {}) {
    return this.requestHttp.get('dms/common/getDailyTime', params);
  }

  /**
 *  每日通时导出
 * @param params Object  请求参数
 */
  exportDailyTime(params = {}) {
    // return this.requestHttp.exportExcel('dms/flowExport/exportDailyTime', params);
    return this.requestHttp.exportExcel('dms/excelExport/exportDailyTime', params);
  }


}
