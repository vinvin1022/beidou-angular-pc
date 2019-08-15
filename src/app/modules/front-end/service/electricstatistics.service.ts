import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class ElectricstatisticsService {
  public loading: Boolean = false;
  public plusPercentage = ['rate1', 'rate3', 'rate4', 'rate6'];

  constructor(private requestHttp: RequestService) { }




  /**
   *  电销项目组织架构统计接口
   * @param params Object  请求参数
   */
  getTargetDivision(params = {}) {
    return this.requestHttp.post('dms/frond/targetDivision', params);
  }

  /**
   *  电销项目维度统计接口
   * @param params Object  请求参数
   */
  getTargetDimension(params = {}) {
    return this.requestHttp.post('dms/frond/targetDimension', params);
  }


  /**
   *  电销项目组织架构明细接口
   * @param params Object  请求参数
   */
  getDetailTargetDivision(params = {}) {
    return this.requestHttp.post('dms/frond/detailTargetDivision', params);
  }

  /**
   *  电销项目维度明细接口
   * @param params Object  请求参数
   */
  getDetailDimension(params = {}) {
    return this.requestHttp.post('dms/frond/detailDimension', params);
  }


  /**
  *  电销项目事业部统计接口
  * @param params Object  请求参数
  */
  getTargetGroupDivision(params = {}) {
    return this.requestHttp.post('dms/frond/targetGroupDivision', params);
  }

  /**
  *  电销项目军团统计接口
  * @param params Object  请求参数
  */
  getTargetGroupLegion(params = {}) {
    return this.requestHttp.post('dms/frond/targetGroupLegion', params);
  }

  /**
  *  电销项目咨询组统计接口
  * @param params Object  请求参数
  */
  getTargetGroupForm(params = {}) {
    return this.requestHttp.post('dms/frond/targetGroupForm', params);
  }

  /**
  *  电销项目咨询师统计接口
  * @param params Object  请求参数
  */
  getTargetGroupUser(params = {}) {
    return this.requestHttp.post('dms/frond/targetGroupUser', params);
  }






  /**
  *  电销名片统计接口
  * @param params Object  请求参数
  */
  getElectricityCard(params = {}) {
    return this.requestHttp.post('dms/frond/electricityCard', params);
  }

  /**
  *  电销名片统计导出
  * @param params Object  请求参数
  */
  exportElectCark(params = {}) {
    return this.requestHttp.exportExcel('dms/flowExport/exportElectCark', params);
  }
}

