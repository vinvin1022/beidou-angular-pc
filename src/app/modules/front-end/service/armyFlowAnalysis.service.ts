import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class ArmyFlowAnalysisService {
  public plusPercentage = ['rate1', 'roi'];
  constructor(private requestHttp: RequestService) { }


  /**
   * @param params 中端军团流量统计接口
   * @param params object  请求参数
   */
  getMidLegionFlow(params = {}) {
    return this.requestHttp.post('dms/middler/midLegionFlow', params);
  }

  /**
   * @param params 军团流量分析导出
   * @param params object  请求参数
   */
  exportMidLegionFlow(params = {}) {
    return this.requestHttp.exportExcel('dms/flowExport/exportMidLegionFlow', params);
  }

}

