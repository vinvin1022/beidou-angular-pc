import { Injectable, EventEmitter } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { setDefaultDate } from 'src/app/tools';


@Injectable()
export class CommonSettargetService {
  public updateMenuFields = new EventEmitter();
  public day = setDefaultDate('period_wid', true);
  public defaultFormData: object = {
    roleType: 1, // 角色类型
    roleId: null // 角色名称
  };

  public roleTypesOptions: Array<{ [key: string]: string | number }> = [
    { optionId: 1, optionName: '流量' },
    { optionId: 2, optionName: '网销' },
    { optionId: 3, optionName: '中端' },
    { optionId: 4, optionName: '在线' },
    { optionId: 5, optionName: '电销' },
    { optionId: 6, optionName: '总览' },
    { optionId: 7, optionName: '网销电销实时' }
  ];

  public reportMenus: object = {
    1: [
      { label: '推广总览', value: 'generalIntroductionA', userDefined: true },
      // { label: '推广指标', value: 'extensionIndex', },
      // { label: '销售指标', value: 'salesTarget', },
      { label: '投放监控', value: 'releaseMonitoring', userDefined: true }
    ],
    2: [
      { label: '网销效率指标统计', value: 'netIndex', userDefined: true },
      { label: '网销项目指标统计', value: 'netStatistics', userDefined: false }
    ],
    3: [
      { label: '中端军团数据分析', value: 'armyDataAnalysis', userDefined: true },
      { label: '中端军团流量分析', value: 'armyFlowAnalysis', userDefined: false }
    ],
    4: [
      { label: '在线统计', value: 'onlineStatistics', userDefined: false }
    ],
    5: [
      { label: '电销效率指标统计(日)', value: 'electricControlday', userDefined: true },
      { label: '电销效率指标统计(周月)', value: 'electricControlmonth', userDefined: true },
      { label: '电销项目指标统计', value: 'electricStatistics', userDefined: false }
    ]
  };


  public customRoleTypesOptions: Array<{ [key: string]: string | number }> = [
    { optionId: 1, optionName: '流量' },
    { optionId: 2, optionName: '网销' },
    { optionId: 3, optionName: '中端' },
    { optionId: 5, optionName: '电销' },
  ];

  public customReportMenus: object = {
    1: [
      { label: '推广总览', value: 'generalIntroductionA', userDefined: true },
      { label: '投放监控', value: 'releaseMonitoring', userDefined: true }
    ],
    2: [
      { label: '网销效率指标统计', value: 'netIndex', userDefined: true }
    ],
    3: [
      { label: '中端军团数据分析', value: 'armyDataAnalysis', userDefined: true }
    ],
    5: [
      { label: '电销效率指标统计(日)', value: 'electricControlday', userDefined: true },
      { label: '电销效率指标统计(周月)', value: 'electricControlmonth', userDefined: true }
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
