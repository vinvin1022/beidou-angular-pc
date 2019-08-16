import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class CtrlUpermissionDialogService {
  public serviceName = 'dms';
  constructor(private requestHttp: RequestService) { }

  /**
   *   根据电话号码查询用户id，姓名
   * @param params object  请求参数
   */
  getUserByPhone(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/getUserByPhone`, params);
  }

  /**
   *   修改用户角色
   * @param params object  请求参数
   */
  updateUserRole(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/updateUserRole`, params);
  }

  /**
   *   添加用户角色
   * @param params object  请求参数
   */
  saveUserRole(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/saveUserRole`, params);
  }
}



