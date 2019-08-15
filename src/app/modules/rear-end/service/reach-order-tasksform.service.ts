import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';

@Injectable({
  providedIn: 'root'
})
export class ReachOrderTasksformService {
  private serviceName = 'dms';
  public loading: Boolean = false;
  public startEndTime: Date = setDefaultDate('period_wid', true);
  public defalutData = {
    deptId: null,  // 部门
    teacherMAIds: null,   // 班主任主管
    teacherIds: null,  // 班主任
    rangePicker: [this.startEndTime, this.startEndTime],  // 时间范围
    bigId: null,  // 售后大类
  };
  constructor(private requestHttp: RequestService) { }


  /**
  *  通过用户token查询用户可查询列表
  * @param params Object  请求参数
  */
  getDeptQueryByToken(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/getDeptQueryByToken`, params);
  }

  /**
  *  通过选择的组织查询班主任管理员
  * @param params Object  请求参数
  */
  queryTeacheerMa(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/queryTeacheerMa`, params);
  }

  /**
  * 通过选择的组织查询班主任
  * @param params Object  请求参数
  */
  queryTeacheer(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/queryTeacheer`, params);
  }


  /**
  * 查询售后分类
  * @param params Object  请求参数
  */
  queryBigType(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/middler/queryBigType`, params);
  }





  /**
  *  获取部门学院
  * @param params Object  请求参数
  */
  getTreeSxDept(params = {}) {
    return this.requestHttp.post('authentication/dept/treeSxDept', params);
  }

  /**
   *  获取班主任
   * @param params Object  请求参数
   */
  getUserByDeptId(params = {}) {
    return this.requestHttp.post('authentication/dept/getUserByDeptId', params);
  }

  /**
   *  获取在岗状态
   * @param params Object  请求参数
   */
  getUserState(params = {}) {
    return this.requestHttp.post('dms/userDept/userState', params);
  }
}
