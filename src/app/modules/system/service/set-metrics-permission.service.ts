import { Injectable, EventEmitter } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';


@Injectable({
  providedIn: 'root'
})
export class SetMetricsPermissionService {
  public updateMenuFields = new EventEmitter();
  public day = setDefaultDate('period_wid', true);
  public defaultFormData: object = {
    roleType: 1, // 角色类型
    roleId: null // 角色名称
  };

  public roleTypesOptions: Array<{ [key: string]: string | number }> = [
    { optionId: 1, optionName: '流量' },
    { optionId: 2, optionName: '前端网销' },
    { optionId: 3, optionName: '中端' },
    { optionId: 4, optionName: '在线' },
    { optionId: 5, optionName: '前端电销' },
    // { optionId: 6, optionName: '业绩总览' }
  ];

  public reportMenus: object = {
    1: [
      { label: '推广总览', value: 'generalIntroductionA', },
      // { label: '推广指标', value: 'extensionIndex', },
      // { label: '销售指标', value: 'salesTarget', },
      { label: '投放监控', value: 'releaseMonitoring', }
    ],
    2: [
      { label: '网销效率指标统计', value: 'netIndex', },
      { label: '网销项目指标统计', value: 'netStatistics', }
    ],
    3: [
      { label: '中端军团数据分析', value: 'armyDataAnalysis', },
      { label: '中端军团流量分析', value: 'armyFlowAnalysis', }
    ],
    4: [
      { label: '在线统计', value: 'onlineStatistics', }
    ],
    5: [
      { label: '电销效率指标统计(日)', value: 'electricControlday', },
      { label: '电销效率指标统计(周月)', value: 'electricControlmonth', },
      { label: '电销项目指标统计', value: 'electricStatistics', }
    ]
  };

  constructor(private requestHttp: RequestService) { }

  /**
   *   查询相应类别下的角色
   * @param params object  请求参数
   */
  getRoleByRoleType(params: object = {}) {
    return this.requestHttp.post('dms/costomMenu/getRoleByRoleType', params);
  }

  /**
   *   保存角色自定义菜单
   *
   * @param params object  请求参数
   */
  saveRoleMenu(params: object = {}) {
    return this.requestHttp.post('dms/costomMenu/saveRoleMenu', params);
  }

  /**
   *   查询角色自定义菜单
   * @param params object  请求参数
   */
  getRoleMenuByMenuId(params: object = {}) {
    return this.requestHttp.post('dms/costomMenu/getRoleMenuByMenuId', params);
  }
}

