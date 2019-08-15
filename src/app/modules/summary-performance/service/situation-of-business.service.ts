import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class SituationOfBusinessService {
  public serviceName = 'dms';
  public loading: Boolean = false;
  public formatTime = ['calLongTime', 'rate8', 'rate9'];
  public plusPercentage = ['orderRate1', 'effRate1', 'firstCaRate'];

  public colors = { '新媒体': '#7bc6ff', '其他': '#FF7E89', 'SEM': '#ffe6bb' };
  public times = new Map([['friallAc10', '08:00-09:59'], ['friallAc12', '10:00-11:59'], ['friallAc14', '12:00-13:59'],
  ['friallAc16', '14:00-15:59'], ['friallAc18', '16:00-17:59'], ['friallAc20', '18:00-19:59'], ['friallAc22', '20:00-22:59']]);
  public carrierOptions: Array<Object> = [
    { optionId: 1, optionName: '组织' },
    { optionId: 2, optionName: '时区' }
  ];
  constructor(private requestHttp: RequestService) { }

  /**
   * 名片概况接口
   * @param url string 请求地址
   * @param params object 请求参数
   */
  queryCardAbout(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/front/act/queryCardAbout`, params);
  }


  /**
   * 查询组织名片折线数据
   * @param url string 请求地址
   * @param params object 请求参数
   */
  queryDeptLine(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/front/act/queryDeptLine`, params);
  }


  /**
   * 查询时间名片折线数据
   * @param url string 请求地址
   * @param params object 请求参数
   */
  queryTimeLine(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/front/act/queryTimeLine`, params);
  }
}
