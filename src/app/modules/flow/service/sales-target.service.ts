import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class SalesTargetService {

  constructor(private requestHttp: RequestService) { }
  /**
   * 流量销售指标
   * @param params Object  请求参数
   */
  getSaleTarget(params = {}) {
    return this.requestHttp.post('dms/view/saleTarget', params);
  }

   /**
   * 推广总览导出
   * @param params Object  请求参数
   */
  flowExportSale(params = {}) {
    // return this.requestHttp.get('dms/flowExport/exportView', params);
    return this.requestHttp.exportExcel('dms/flowExport/exportSale', params);
  }
}
