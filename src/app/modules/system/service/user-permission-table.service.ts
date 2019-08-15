import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class UserPermissionTableService {
  public serviceName = 'dms';
  constructor(private requestHttp: RequestService) { }

  /**
   *   查询用户列表
   * @param params Object  请求参数
   */
  queryUserRole(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/queryUserRole`, params);
  }

  /**
  *   删除用户角色
  * @param params Object  请求参数
  */
  deleteUserRole(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/deleteUserRole`, params);
  }


  /**
  *   获取北斗分模块组织架构
  * @param params Object  请求参数
  */
  queryDeptTeam(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/queryDeptTeam`, params);
  }

  /**
  *   查询用户数据权限根据id
  * @param params Object  请求参数
  */
  getUserDateVOByUserId(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/getUserDateVOByUserId`, params);
  }


  /**
  *   保存用户数据权限
  * @param params Object  请求参数
  */
  saveUserDate(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/saveUserDate`, params);
  }



}

