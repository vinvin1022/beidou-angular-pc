import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class ArmyDataAnalysisService {
  public formatTime = ['rate9', 'rate10'];
  public plusPercentage = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate7', 'rate8'];

  constructor(private requestHttp: RequestService) { }


  /**
   *  中端军团数据统计接口
   * @param params Object  请求参数
   */
  getMidLegionData(params = {}) {
    return this.requestHttp.post('dms/middler/midLegionData', params);
  }

  /**
   *  军团数据分析导出
   * @param params Object  请求参数
   */
  exportMidLegionData(params = {}) {
    return this.requestHttp.exportExcel('dms/flowExport/exportMidLegionData', params);
  }


}

