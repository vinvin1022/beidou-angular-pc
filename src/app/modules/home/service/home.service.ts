import { Injectable } from '@angular/core';
import { RequestService } from '../../../service/request.service';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {
  public indexDeptOptions: object;
  constructor(private requestHttp: RequestService) { }

  /**
   * (实时)首页接口
   * @param params object 请求参数
   */
  getHomePage(params = {}): Observable<any> {
    const url = 'dms/frond/homePage';
    return this.requestHttp.get(url, params);
  }

  /**
   * 业绩排行接口
   * @param params object
   */
  getPerferRank(params = {}): Observable<any> {
    const url = 'dms/frond/perferRank';
    return this.requestHttp.get(url, params);
  }


  /**
   * 7日内消费接口
   * @param params object
   */
  getSevenDayFinance(params = {}): Observable<any> {
    const url = 'dms/frond/sevenDayFinance';
    return this.requestHttp.get(url, params);
  }

  /**
   * 7日内费比接口
   * @param params object
   */
  getSevenDayFeeRatio(params = {}): Observable<any> {
    const url = 'dms/frond/sevenDayFeeRatio';
    return this.requestHttp.get(url, params);
  }

  /**
   * 预约单记录接口
   * @param params object
   */
  getBookForm(params = {}): Observable<any> {
    const url = 'dms/frond/bookForm';
    return this.requestHttp.post(url, params);
  }

  /**
   * 平均通话接口
   * @param params object
   */
  getAverageCall(params = {}): Observable<any> {
    const url = 'dms/frond/averageCall';
    return this.requestHttp.post(url, params);
  }
}
