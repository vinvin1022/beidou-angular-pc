import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class NetstatisticsService {
  public loading = false;
  public plusPercentage = ['rate1', 'roi'];

  constructor(private requestHttp: RequestService) { }

  /**
   * 网销项目统计接口
   * @param url 请求参数
   * @param params 请求参数
   */
  getDivisionSaleProject(url: string = 'dms/frond/divisionSaleProject', params = {}) {
    return this.requestHttp.post(url, params);
  }



  /**
   * 网销项目明细接口
   * @param url url
   * @param params 请求参数
   */
  getDetailSaleProject(url: string = 'dms/frond/detailSaleProject', params = {}) {
    return this.requestHttp.post(url, params);
  }

  /**
   * 网销项目接口
   */
  getNetSaleProject(params = {}) {
    return this.requestHttp.post('dms/frond/netSaleProject', params);
  }

  /**
   * 网销项目指标统计导出
   */
  exportNetSaleProject(params = {}) {
    return this.requestHttp.exportExcel('dms/flowExport/exportNetSaleProject', params);
  }
}
