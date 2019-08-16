import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class ElectricControlService {
  public loading = false;
  public periodType = 'period_wid';
  public periodWidColumn;
  public weekInyearColumn;

  public formatTime = ['calLongTime', 'firstTimediffAlCal', 'timediffAlFl'];

  public plusPercentageday = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate7'];
  public plusPercentagemonth = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate7', 'rate8', 'rate9', 'rate10', 'rate11',
    'rate12', 'rate13', 'rate15', 'rate16', 'rate17', 'rate18', 'rate19', 'rate20', 'rate191'];


  constructor(private requestHttp: RequestService) { }



  // /**
  // *  电销日控接口
  // * @param params object  请求参数
  // */
  // getElectricityDay(params = {}) {
  //   return this.requestHttp.post('dms/frond/electricityDay', params);
  // }

  // /**
  // *  电销周_月控接口
  // * @param params object  请求参数
  // */
  // getElectricityFrond(params = {}) {
  //   return this.requestHttp.post('dms/frond/electricityFrond', params);
  // }

  // /**
  //   *  电销日控事业部统计接口
  //   * @param params DayGroupDivisionParams  请求参数
  //   */
  // getGroupDivision(params: DayGroupDivisionParams = {}) {
  //   return this.requestHttp.post('dms/frond/groupDivision', params);
  // }

  /**
   * 电销日控事业部明细接口
   * @param url url
   * @param params 请求参数
   */
  getDetailDivision(url = 'dms/frond/detailDivision', params: DayGroupDivisionParams = {}) {
    return this.requestHttp.post(url, params);
  }


  /**
   * 电销日控事业部统计接口
   *  @param params object  请求参数
   */
  getDayGroupDivision(params = {}) {
    return this.requestHttp.post('dms/frond/DayGroupDivision', params);
  }

  /**
   * 电销日控军团统计接口
   * @param params object  请求参数
   */
  getDayGroupLegion(params = {}) {
    return this.requestHttp.post('dms/frond/groupLegion', params);
  }


  /**
   * 电销日控咨询组统计接口
   * @param params object  请求参数
   */
  getDayGroupForm(params = {}) {
    return this.requestHttp.post('dms/frond/groupForm', params);
  }

  /**
   * 电销日控咨询师统计接口
   * @param params object  请求参数
   */
  getDayGroupUser(params = {}) {
    return this.requestHttp.post('dms/frond/groupUser', params);
  }



  /**
   * 电销日周月控导出
   * @param params object  请求参数
   */
  exportElectDayWeekMonth(params = {}) {
    // return this.requestHttp.exportExcel('dms/flowExport/exportElectDayWeekMonth', params);
    return this.requestHttp.exportExcel('dms/excelExport/electDayWeekMonthExport', params);

  }


}

export interface DayGroupDivisionParams {
  business?: Array<string>;
  deptId1?: Array<string>;
  deptId2?: Array<string>;
  endTime?: string;
  periodType?: string;
  startTime?: string;
  userId?: Array<string>;
  queryValue?: string;
  pageNo?: number;
  pageSize?: number;
}
