import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';

@Injectable()
export class FrontRealFormService {
  public loading: Boolean = false;
  private serviceName = 'dms';
  public NOWTIME = [setDefaultDate('period_wid', true), setDefaultDate('period_wid', true)];
  public defalutData = {
    dept0: [],
    dept: [],  // 事业部
    legion: [],   // 军团
    group: [],  // 咨询组
    userId: [],   // 咨询师
    advertisersTypeList: [], // 推广方式
    rangePicker: this.NOWTIME // 时间范围
  };
  constructor(private requestHttp: RequestService) { }

  /**
 * 获取模式
 * @param params Object  请求参数
 */
  queryPattern(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/queryPattern`, params);
  }



}
