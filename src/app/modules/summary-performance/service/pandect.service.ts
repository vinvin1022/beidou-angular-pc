import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class PandectService {
  public loading: Boolean = false;
  public day = new Date(new Date().getTime() - 24 * 3600 * 1000);
  public defaultFormData = {
    dept: [],
    userId: [],
    periodType: 'period_wid',
    rangePicker: [this.day, this.day],
    indexItem: '1'
  };


  public timeTypes: Array<Object> = [
    { key: 'period_wid', value: '日' },
    { key: 'week_inyear', value: '周' },
    { key: 'period_month', value: '月' },
    { key: 'period_year', value: '年' }
  ];

  public deptOptions = [
    { value: '4', label: '黄金糕' },
    { value: '1', label: '哈哈哈' },
    { value: '2', label: '呵呵呵' },
    { value: '3', label: '嘿嘿嘿' }
  ];

  public indexItems: Array<Object> = [
    { key: '1', value: '流水' },
    { key: '2', value: '名片数' },
    { key: '3', value: '销售机会数' },
    { key: '4', value: '报名数' },
    { key: '5', value: 'ARPU' },
    { key: '6', value: '财务消费' },
    { key: '7', value: 'CPA' },
    { key: '8', value: 'ROI' },
    { key: '9', value: '销转' },
    { key: '10', value: '有效率' }
  ];
  constructor(private requestHttp: RequestService) { }

   /**
   * 获取业绩总览
   * @param params Object  请求参数
   */
  getIndexItem(params = {}) {
    return this.requestHttp.post('dms/view/indexItem', params);
  }

  /**
   * 业绩总览导出
   * @param params Object  请求参数
   */
  indexItemExport(params = {}) {
    return this.requestHttp.exportExcel('dms/flowExport/exportIndexItem', params);
  }
}
