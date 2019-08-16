import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class NetindexService {
  public loading = false;
  public formatTime = ['calLongTime', 'rate8', 'rate9'];
  public plusPercentage = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate', 'rate7'];
  constructor(private requestHttp: RequestService) { }




  /**
   * 获取表格数据
   * @param url string 请求地址
   * @param params object 请求参数
   */
  getDivisonNetSaleData(url: string = 'dms/frond/divisonNetSale', params: object = {}) {
    return this.requestHttp.post(url, params);
  }




  /**
   *  网销过程事业部明细指标接口
   * @param params object  请求参数
   */
  getDivisionNetSaleDetail(url: string = 'dms/frond/divisionNetSaleDetail', params = {}) {
    return this.requestHttp.post(url, params);
  }

  /**
   * 网销过程军团明细指标接口
   * @param params 請求參數
   */
  getLegionNetSaleDetail(params = {}) {
    return this.requestHttp.post('dms/frond/legionNetSaleDetail', params);
  }

  /**
   *  网销过程项目组明细指标接口
   * @param params object  请求参数
   */
  getFormNetSaleDetail(params = {}) {
    return this.requestHttp.post('dms/frond/formNetSaleDetail', params);
  }


  /**
   * 网销过程用户明细指标接口
   * @param params 请求参数
   */
  getUserNetSaleDetail(params = {}) {
    return this.requestHttp.post('dms/frond/userNetSaleDetail', params);
  }






  /**
   * 网销效率指标统计接口
   * @param params 请求参数
   */
  getTargetNetSale(params = {}) {
    return this.requestHttp.post('dms/frond/targetNetSale', params);
  }

  /**
   * 网销效率指标统计导出
   * @param params 请求参数
   */
  exportNetSaleTarget(params = {}) {
    // return this.requestHttp.exportExcel('dms/flowExport/exportNetSaleTarget', params);
    return this.requestHttp.exportExcel('dms/excelExport/netSaleTargetExcelExport', params);
  }
}
