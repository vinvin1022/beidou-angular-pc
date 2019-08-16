import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class UserPermissionTableService {
  public serviceName = 'dms';
  constructor(private requestHttp: RequestService) { }

  /**
   *   查询用户列表
   * @param params object  请求参数
   */
  queryUserRole(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/queryUserRole`, params);
  }

  /**
   *   删除用户角色
   * @param params object  请求参数
   */
  deleteUserRole(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/deleteUserRole`, params);
  }


  /**
   *   获取北斗分模块组织架构
   * @param params object  请求参数
   */
  queryDeptTeam(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/queryDeptTeam`, params);
  }

  /**
   *   查询用户数据权限根据id
   * @param params object  请求参数
   */
  getUserDateVOByUserId(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/getUserDateVOByUserId`, params);
  }


  /**
   *   保存用户数据权限
   * @param params object  请求参数
   */
  saveUserDate(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/saveUserDate`, params);
  }



}

