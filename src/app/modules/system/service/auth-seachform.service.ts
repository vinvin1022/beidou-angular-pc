import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { Subject } from 'rxjs';

@Injectable()
export class AuthSeachformService {
  public loading = false;
  public defaultFormData: Object = {
    roleType: null, // 角色类型
    roleId: null, // 角色名称
    userName: null  // 用户名称
  };
  // private sxSubject$ = new Subject<any>();


  constructor(private requestHttp: RequestService) { }


  // subscribMessage(key: string = 'sxSubject$') {
  //   return this[key].asObservable();
  // }

  // sendMessage(val, key: string = 'sxSubject$') {
  //   this[key].next(val);
  // }
  // unsubscribMessage(key: string = 'sxSubject$') {
  //   this[key].unsubscribe();
  // }
  /**
   *   查询相应类别下的角色
   * @param params Object  请求参数
   */
  getRoleByRoleType(params: Object = {}) {
    return this.requestHttp.post('dms/costomMenu/getRoleByRoleType', params);
  }
}



