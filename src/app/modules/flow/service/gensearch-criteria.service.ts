import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { formatDate, setDefaultDate, setPurviewDefaultDate } from '../../../tools';

@Injectable({
  providedIn: 'root'
})
export class GensearchCriteriaService {
  public isShowRegistCity = true;
  // 是否显示条件
  public isShowMore = true;
  // 是否显示维度
  public isShowDimension = true;
  // 是否显示对比时间
  public isShowContrast = true;
  // 是否显示年条件
  public isShowYear = true;
  public formData: object;
  public flowValidateForm;
  public loading = false;
  public NOWTIME = [setDefaultDate('period_wid', true), setDefaultDate('period_wid', true)];
  public queryDimensionOptions: Array<object> = [
    { value: 'men_area_name', label: '报名城市', disabled: false, checked: false },
    { value: 'fl_consulting_project', label: '推广项目', disabled: false, checked: false },
    { value: 'flowin_depid', label: '事业部', disabled: false, checked: false },
    { value: 'dept_id_1', label: '流量军团', disabled: false, checked: false },
    { value: 'dept_id_2', label: '流量组', disabled: false, checked: false },
    { value: 'user_id', label: '流量人员', disabled: false, checked: false },
    { value: 'account_name', label: '推广账户', disabled: false, checked: false },
    { value: 'site_number', label: '推广站点', disabled: false, checked: false },
    { value: 'web_uid', label: '主域名', disabled: false, checked: false },
    { value: 'code', label: '推广渠道', disabled: false, checked: false },
    { value: 'city_name', label: '推广城市', disabled: false, checked: false },
    { value: 'advertisers_type', label: '推广方式', disabled: false, checked: false },
    { value: 'source', label: '推广来源', disabled: false, checked: false },
    { value: 'carrier', label: '载体', disabled: false, checked: false }
  ];
  public defaultFormData = {
    menAreaCode: [],   // 报名城市
    flowDataType: '1',  // 业务模式
    flConsultingProject: [],  // 推广项目
    periodType: 'period_wid',   // 时间类型
    rangePicker: this.NOWTIME,   // 时间类型范围值
    contrastRangePicker: [], // 时间类型对比范围值
    divisionId: [],  // 事业部
    deptId1: [],   // 流量军团
    deptId2: [],  // 流量组
    userId: [],  // 流量人员
    accountUid: [],   // 推广账户
    siteNumber: [],   // 推广站点
    accountUids: [],  // 推广账户包
    siteNumbers: [],  // 推广站点包
    webUid: [],   // 主域名
    code: [],  // 推广渠道
    cityName: [],  // 推广城市
    advertisersType: '全部',   // 推广方式
    carrier: [],   // 载体
    source: '全部',  // 推广来源
    queryDimension: this.queryDimensionOptions, // 维度
    isContrast: false,  // 是否对比
    contrastStartTime: null, // 对比开始时间
    contrastEndTime: null, // 对比结束时间
    startTime: null,
    endTime: null,
  };

  // 业务模式
  public flowDataTypeOptions: Array<object> = [
    { optionId: '1', optionName: '电销' },
    { optionId: '2', optionName: '网销' },
  ];

  // 载体下拉选项
  public carrierOptions: Array<object> = [
    { optionId: '0', optionName: '未知' },
    { optionId: '1', optionName: 'PC' },
    { optionId: '2', optionName: 'MB' },
    { optionId: '3', optionName: 'WZ' }
  ];

  // 业务模式
  public flowDataType = '1';


  public flConsultingProjectOptions;  // 推广项目下来下拉选项
  public siteNumberOptions; // 推广站点下拉选项
  public webUidOptions; // 主域名
  public codeOptions; // 推广渠道
  public sourceOptions; // 推广来源

  constructor(private requestHttp: RequestService) {
    // const { startTime, endTime } = setPurviewDefaultDate();
    // this.defaultFormData['startTime'] = startTime;
    // this.defaultFormData['endTime'] = endTime;
  }


  _setEndTime() {
    const nowTimeDate = new Date();
    const time = nowTimeDate.getTime();
    const dayTime = 24 * 3600 * 1000;
    const day = nowTimeDate.getDay() === 0 ? 7 : nowTimeDate.getDay();
    const endvalue = time - (day * dayTime) + dayTime;
    return endvalue;
  }


  /**
   * 暂时不用 使用tools的方法
   * @param filterData 參數
   */
  setFinalFilterData(filterData: object = {}) {
    const flowViewReportParams = {};
    for (const key in filterData) {
      if (filterData.hasOwnProperty(key)) {
        const element = filterData[key];
        if (element && Array.isArray(element) && element.length) {
          if (key === 'rangePicker') {
            if (element[0]) {
              flowViewReportParams['startTime'] = formatDate(element[0], 'yyyy-MM-dd');
            }
            if (element[1]) {
              flowViewReportParams['endTime'] = formatDate(element[1], 'yyyy-MM-dd');
            }
          } else if (key === 'accountUids' || key === 'siteNumbers') {
            const tmpArr = [];
            element.forEach((value) => { tmpArr.push(...(value.split(','))); });
            flowViewReportParams[key] = Array.from(new Set(tmpArr));
          } else {
            flowViewReportParams[key] = element;
          }
        } else if (element && typeof element === 'string') {
          flowViewReportParams[key] = element;
        } else if (element && (element instanceof Date)) {
          flowViewReportParams[key] = formatDate(element, 'yyyy-MM-dd');
        }
      }
    }
    return flowViewReportParams;
  }


  formateFlowDataType(flowDataType: string) {
    return this.flowDataTypeOptions.find((item) => flowDataType === item['optionId']);
  }



  /**
   * 获取推广来源
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getQuerySourceName(params = {}) {
    return this.requestHttp.post('dms/userDept/querySourceName', params);
  }
  /**
   * 获取推广城市下拉列表
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getSpreadCitylist(params = {}) {
    return this.requestHttp.post('dms/userDept/queryCityName', params);
  }
  /**
   * 获取推广账户下来列表
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getQueryAccount(params = {}) {
    return this.requestHttp.post('dms/userDept/queryAccountName', params);
  }

  /**
   *  获取推广项目列表
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getFlConsultingProjectOptions(params = {}) {
    return this.requestHttp.post('dms/userDept/queryProjectName', params);
  }

  /**
   * 获取推广渠道
   * @param params 请求参数
   */
  getCodeOptions(params = {}) {
    return this.requestHttp.post('dms/userDept/queryCodeName', params);
  }

  /**
   *  获取推广站点
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getSiteNumberOptions(params = {}) {
    return this.requestHttp.post('dms/userDept/querySiteNumber', params);
  }


  /**
   *  获取报名城市
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getMenAreaCodeOptions(params = {}) {
    return this.requestHttp.post('dms/userDept/queryCampusName', params);
  }

  /**
   *  获取主域名
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getWebUidOptions(params = {}) {
    return this.requestHttp.post('dms/userDept/queryWebName', params);
  }


  /**
   *  获取推广方式
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getAdvertisersTypeOptions(params = {}) {
    return this.requestHttp.post('dms/userDept/queryAdvertisersName', params);
  }

  /**
   * 获取组织架构
   * @param params string   请求地址
   * @param params object  请求参数
   */
  getQueryDept(params: object = {}) {
    return this.requestHttp.post('authentication/dept/list', params);
  }

  /**
   * 获取详细人员
   * @param params 请求参数
   */
  getUserIdOptions(params: object = {}) {
    return this.requestHttp.post('authentication/dept/getUserByDeptId', params);
  }




  /**
   * 获取事业部
   * @param params object  请求参数
   */
  getDivision(params: object = {}) {
    return this.requestHttp.post('dms/userDept/getDivision', params);
  }

  /**
   * 获取流量军团
   * @param params object  请求参数
   */
  getDeptOptions(params: object = {}) {
    return this.requestHttp.post('dms/userDept/getDept', params);
  }

  /**
   * 获取流量组
   * @param params object  请求参数
   */
  getGroupOptions(params: object = {}) {
    return this.requestHttp.post('dms/userDept/getGroup', params);
  }

  /**
   * 获取流量人员
   * @param params object  请求参数
   */
  getUserOptions(params: object = {}) {
    return this.requestHttp.post('dms/userDept/getUser', params);
  }

  /**
   * 获取推广账户包接口
   * @param params object  请求参数
   */
  getQueryAccountPackage(params: object = {}) {
    return this.requestHttp.post('dms/view/queryAccountPackage', params);
  }

  /**
   * 获取推广站点包接口
   * @param params object  请求参数
   */
  getQuerySitePackage(params: object = {}) {
    return this.requestHttp.post('dms/view/querySitePackage', params);
  }
}



