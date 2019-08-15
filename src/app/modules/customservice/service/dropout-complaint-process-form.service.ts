import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';

@Injectable({
  providedIn: 'root'
})
export class DropoutComplaintProcessFormService {
  public loading: Boolean = false;
  public startEndTime: Date = setDefaultDate('period_wid', true);
  public defalutData = {
    deptName: null,  // 部门 学院
    userId: null,  // 班主任
    state: '全部',   // 在岗状态
    rangePicker: [this.startEndTime, this.startEndTime]  // 时间范围
  };
  constructor(private requestHttp: RequestService) { }

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
