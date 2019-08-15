import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class SituationBusinessFormService {
  public loading: Boolean = false;
  private serviceName = 'dms';
  public defalutData = {
    dept0: [],
    dept: [],  // 事业部
    advertisersNameList: [],  // 渠道
    advertisersLegion: [],  // 流量军团
    advertisersTypeList: [] // 推广方式
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
