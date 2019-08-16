import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionPerformanceService {

  constructor(private requestHttp: RequestService) { }
  /**
   *  自营业绩统计接口
   * @param params object  请求参数
   */
  queryBackPromotion(params = {}) {
    return this.requestHttp.post('dms/back/promotion/queryBackPromotion', params);
  }


  /**
   * 升班业绩报表导出
   * @param params 请求参数
   */
  exportBackPromotion(params = {}) {
    return this.requestHttp.exportExcel('dms/excelExport/exportBackPromotion', params);
  }


  /**
   * 保存导出升班业绩
   * @param params 请求参数
   */
  saveBackQueryVO(params = {}) {
    return this.requestHttp.post('dms/excelExport/saveBackQueryVO', params);
  }


}
