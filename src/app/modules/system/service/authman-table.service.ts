import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class AuthmanTableService {
  public serviceName = 'dms';
  constructor(private requestHttp: RequestService) { }

  /**
   *   查询角色人数列表
   * @param params Object  请求参数
   */
  queryPowerUserNum(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/queryPowerUserNum`, params);
  }

  /**
   *   修改角色
   * @param params Object  请求参数
   */
  updateRole(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/updateRole`, params);
  }

   /**
   *   添加角色
   * @param params Object  请求参数
   */
  saveRole(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/saveRole`, params);
  }

   /**
   *   删除角色
   * @param params Object  请求参数
   */
  deleteUserRoleById(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/deleteUserRoleById`, params);
  }
}



