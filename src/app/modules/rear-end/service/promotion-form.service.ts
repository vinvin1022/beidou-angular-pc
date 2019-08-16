import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';

@Injectable({
  providedIn: 'root'
})
export class PromotionformService {
  public loading = false;
  public startEndTime: Date = setDefaultDate('period_wid', true);
  public defalutData = {
    deptNames: [],  // 部门
    teacherIds: [],  // 班主任
    userState: '全部',   // 在岗状态
    rangePicker: [this.startEndTime, this.startEndTime]  // 时间范围
  };
  constructor(private requestHttp: RequestService) { }

  /**
   * 获取部门学院
   * @param params 請求參數
   */
  querydeptName(params = {}) {
    return this.requestHttp.post('dms/back/promotion/querydeptName', params);
  }

  /**
   *  获取班主任
   * @param params object  请求参数
   */
  queryTeacher(params = {}) {
    return this.requestHttp.post('dms/back/promotion/queryTeacher', params);
  }

  /**
   *  获取在岗状态
   * @param params object  请求参数
   */
  queryUserState(params = {}) {
    return this.requestHttp.post('dms/back/promotion/queryUserState', params);
  }
}
