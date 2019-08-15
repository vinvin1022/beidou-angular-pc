import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class TrafficSearchFormService {
  public loading = false;
  public defaultFormData = {
    dept1List: [],   // 流量军团
    dept2List: [],  // 流量组
    userList: [],  // 流量人员
    divisionList: [],   // 事业部
    advertisersTypeList: [],  // 推广方式
    advertisersNameList: [],   // 推广渠道
  };
  public serviceName = 'dms';
  constructor(private requestHttp: RequestService) { }

  /**
   * 查询军团列表
   * @param params Object  请求参数
   */
  getSelectDept1(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/flowAct/realtime/selectDept1`, params);
  }

  /**
   * 查询组信息
   * @param params Object  请求参数
   */
  getSelectDept2(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/flowAct/realtime/selectDept2`, params);
  }
  /**
   * 查询流量师
   * @param url String   请求地址
   * @param params Object  请求参数
   */
  getSelectUserByDept(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/flowAct/realtime/selectUserByDept`, params);
  }
}
