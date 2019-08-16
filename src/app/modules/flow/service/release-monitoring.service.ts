import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseMonitoringService {
  public plusPercentage = ['rate1', 'rate2', 'rate3', 'rate6', 'rate7', 'rate8', 'rate9', 'rate12', 'rate13', 'rate14', 'rate15', 'rate16',
    'rate17', 'rate19', 'rate21', 'rate22', 'rate23', 'rate24', 'rate25', 'rate26', 'rate27', 'rate28', 'rate29', 'ctr'];
  public tdColumn: Array<string> = [
    '总流水', '7日内流水', '14日内流水', '跨期流水', '总费比(%)', '当周费比(%)', '总名片数', '首咨分配数', '在线名片', '留言名片', '在线占比(%)', '名片成本', '销机', 'CPA', '电销',
    '总有效性', '在线有效性', '留言有效性', '网销', '总加成率(%)', '在线加成率(%)', '留言加成率(%)', 'RPA', 'RPC', '报名率(%)', '7日内报名率(%)', '14日内报名率(%)',
    '跨期报名率(%)', '在线报名率(%)', '留言报名率(%)', '总销转(%)', '7日内销转(%)', '14日内销转(%)', '跨期销转(%)', '在线销转(%)', '留言销转(%)', 'ARPU', '总报名数',
    '7日内报名数', '14日内报名数', '跨期报名数', '在线报名数', '留言报名数', '记录率(%)', '展现量', '点击量', '账面消费', '财务消费', 'CPC', 'CTR(%)', '网电(%)', '对话有效率(%)',
    '发起到有效率(%)', '在线转化率(%)'
  ];
  constructor(private requestHttp: RequestService) { }
  /**
   * 投放监控统计接口
   * @param params object  请求参数
   */
  getGroupLaunchMonitor(params = {}) {
    return this.requestHttp.post('dms/view/groupLaunchMonitor', params);
  }


  /**
   * 投放监控明细接口
   * @param params object  请求参数
   */
  getDetailLaunchMonitor(params = {}) {
    return this.requestHttp.post('dms/view/detailLaunchMonitor', params);
  }

  /**
   * 投放监控导出
   * @param params 请求参数
   */
  exportLaunchMonitor(params = {}) {
    // return this.requestHttp.exportExcel('dms/flowExport/exportLaunchMonitor', params);
    return this.requestHttp.exportExcel('dms/excelExport/exportLaunchMonitor', params);
  }
}
