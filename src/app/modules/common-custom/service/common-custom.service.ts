import { Injectable } from '@angular/core';
import { RequestService } from '../../../service/request.service';

import { Observable } from 'rxjs';
import { formattingTime } from 'src/app/tools';

@Injectable()
export class CommonCustomService {
  public indexDeptOptions: Object;
  public serviceName: String = 'dms';
  constructor(private requestHttp: RequestService) { }


  /**
* 获取模式
* @param params Object  请求参数
*/
  queryPattern(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/queryPattern`, params);
  }

  /**
   * 获取事业部
   * @param params Object
   */
  getIndexDept(params = {}): Observable<any> {
    const url = `${this.serviceName}/userDept/indexDept`;
    return this.requestHttp.post(url, params);
  }

  /**
*  获取推广渠道
* @param url String   请求地址
* @param params Object  请求参数
*/
  getCodeOptions(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/queryCodeName`, params);
  }

  /**
   * 获取流量军团
   * @param params Object  请求参数
   */
  getDeptOptions(params: Object = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/getDept`, params);
  }

  /**
  *  获取推广方式
  * @param url String   请求地址
  * @param params Object  请求参数
  */
  getAdvertisersTypeOptions(params = {}) {
    return this.requestHttp.post(`${this.serviceName}/userDept/queryAdvertisersName`, params);
  }

  /**
*  公共导出前
* @param params Object  请求参数
*/
  exportNetSaleTargetPost(params = {}) {
    // return this.requestHttp.exportExcel('dms/flowExport/exportNetSaleTarget', params);
    return this.requestHttp.post('dms/excelExport/savaMenuCostom', params);
  }

  /**
   *  获取推广人
   * @param params Object  请求参数
   */
  getPromoterName(params = {}) {
    return this.requestHttp.post('dms/userDept/promoterName', params);
  }

  /**
   * 取消Observable订阅
   * @param subscribeAll$ Object
   */
  unsubscribe(subscribeAll$: Object = {}) {
    for (const key in subscribeAll$) {
      if (subscribeAll$.hasOwnProperty(key)) {
        if (subscribeAll$[key]) {
          subscribeAll$[key].unsubscribe();
        }
      }
    }
  }

  /**
   * 禁用时间范围（日(范围2周内),周(范围3月内),月(范围6月内) ）
   * @param startTime Date 开始时间
   * @param currentTime Date 当前时间
   * @param periodType String 时间类型 （日，周，月）
   */
  disabledTimeRange(startTime, currentTime, periodType) {
    if (!startTime || !periodType || !currentTime) {
      throw new Error('参数错误(startTime, currentTime, periodType)');
    }
    const newDate = new Date(startTime);
    if (startTime) {
      switch (periodType) {
        case 'period_wid':
          newDate.setDate(newDate.getDate() + 14);
          break;
        case 'week_inyear':
          newDate.setMonth(newDate.getMonth() + 3);
          break;
        case 'period_month':
          newDate.setMonth(newDate.getMonth() + 6);
          break;
        default:
          break;
      }
    }
    if (startTime) {
      return (currentTime.getTime() < startTime.getTime()) || (currentTime.getTime() >= newDate.getTime())
        || currentTime.getTime() > new Date().getTime();
    } else {
      return currentTime.getTime() > new Date().getTime();
    }
  }


  /**
   * 专门为日(范围2周内)，周(范围3月内)，月(范围6月内) 设置结束默认时间
   * @param startTime 开始时间
   * @param periodType 时间类型
   */
  setEndTime(startTime, periodType) {
    if (!startTime || !periodType) {
      throw new Error('参数错误(startTime, periodType)');
    }
    let newDate = new Date(startTime);
    switch (periodType) {
      case 'period_wid':
        newDate.setDate(newDate.getDate() + 13);
        break;
      case 'week_inyear':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
      case 'period_month':
        newDate.setMonth(newDate.getMonth() + 6);
        break;
      default:
        break;
    }
    const nowDate = new Date();
    if (newDate.getTime() > nowDate.getTime()) {
      newDate = nowDate;
    }
    return newDate;
  }


  /**
   * 表格列添加%号
   * @param data Array
   */
  plusPercentageColomn(newData: Array<any> = [], plusPercentage: Array<string>, formatTime: string[] = []) {
    // const newData = [...data];
    newData.map((item) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if ((item[key] || item[key] === 0) && plusPercentage.includes(key)) {
            item[key] = item[key] + '%';
          }
          if ((item[key] || item[key] === 0) && formatTime.includes(key)) {
            item[key] = formattingTime(item[key]);
          }
        }
      }
      return item;
    });
    return newData;
  }


  setWidthConfig(length: number, extraArr?: Array<string>, defaultWidth: string = '100px'): Array<string> {
    let widthConfig = [];
    if (Array.isArray(extraArr)) {
      widthConfig = [...extraArr];
    }
    // const length = this.electricStatisticsFieldData['length'] + 2;
    for (let index = 0; index < length; index++) {
      widthConfig.push(defaultWidth);
    }
    return widthConfig;
  }

  setScrollWidth(widthConfigArr: Array<string>) {
    const newTotal = widthConfigArr.reduce((total: number, currentValue: string) => {
      const newcurrentValue = parseInt(currentValue as string, 10);
      return total + newcurrentValue;
    }, 0);
    return { x: newTotal + 'px', y: '500px' };
  }

  /*
* 获取浏览器版本信息
*/
  getBrowserInfo() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let browserType = '';
    let browserVersion = '';
    if (userAgent.match(/msie/) != null || userAgent.match(/trident/) != null) {   // 浏览器类型-IE
      browserType = 'IE';
      browserVersion = this._getIeVersion();
    } else if (window['opera'] || (userAgent.indexOf('opr') > 0)) {  // 欧朋
      browserType = '欧朋';
      browserVersion = this._getOperaVersion(userAgent);
    } else if (userAgent.indexOf('ubrowser') > 0) { // UC
      browserType = 'UC';
      browserVersion = userAgent.match(/ubrowser\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('bidubrowser') > 0) {  // 百度
      browserType = '百度';
      browserVersion = userAgent.match(/bidubrowser\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('metasr') > 0 || userAgent.indexOf('se 2.x') > 0) {   // 搜狗
      browserType = '搜狗';
      // browserVersion =  userAgent.match(/metasr\/([\d.]+)/)[1]
    } else if (userAgent.indexOf('tencenttraveler') > 0) {  // QQ
      browserType = 'QQ';
      browserVersion = userAgent.match(/tencenttraveler\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('qqbrowser') > 0) { // QQ
      browserType = 'QQ';
      browserVersion = userAgent.match(/qqbrowser\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('maxthon') > 0) {   // 遨游
      browserType = '遨游';
      browserVersion = userAgent.match(/maxthon\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('firefox') > 0) {  // 火狐
      browserType = '火狐';
      browserVersion = userAgent.match(/firefox\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('edge') > 0) {  // edge
      browserType = 'Edge';
      browserVersion = userAgent.match(/edge\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('chrome') > 0) {    // 谷歌/360
      if (this._validate360('type', 'application/x360mmplugin')) {
        browserType = '360';
        // browserVersion =  userAgent.match(/chrome\/([\d.]+)/)[1]
      } else {
        browserType = '谷歌';
        browserVersion = userAgent.match(/chrome\/([\d.]+)/)[1];
      }
    } else if (userAgent.indexOf('Safari') > -1) {  // 苹果
      browserType = 'Safari';
      browserVersion = userAgent.match(/version\/([\d.]+)/)[1];
    }
    // return browserType + ' ' + browserVersion;
    return { browserType, browserVersion };
  }

  /*
  * 获取IE浏览器版本
  */
  private _getIeVersion() {
    const IEMode = document['documentMode'];
    const rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
    const ma = window.navigator.userAgent.toLowerCase();
    const match = rMsie.exec(ma);
    try {
      return match[2];
    } catch (e) {
      return IEMode;
    }
  }
  /*
   * 获取oper浏览器版本
   */
  private _getOperaVersion(userAgent) {
    try {
      if (window['opera']) {
        return userAgent.match(/opera.([\d.]+)/)[1];
      } else if (userAgent.indexOf('opr') > 0) {
        return userAgent.match(/opr\/([\d.]+)/)[1];
      }
    } catch (e) {
      return 0;
    }
  }
  /*
   * 判断是否为360浏览器
   */
  private _validate360(option, value) {
    const mimeTypes = window.navigator.mimeTypes;
    for (const mt in mimeTypes) {
      if (mimeTypes.hasOwnProperty(mt)) {
        if (mimeTypes[mt][option] === value) {
          return true;
        }
      }
    }

    return false;
  }
}
