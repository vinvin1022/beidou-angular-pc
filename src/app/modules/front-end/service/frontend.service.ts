import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { CustomColumnDialogService } from '../../common-custom/service/custom-column-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class FrontendService {
  public staticFileds = [{ name: '事业部', exName: 'deptDivisionName', sort: 0 }, { name: '军团', exName: 'deptLegionName', sort: 1 },
  { name: '咨询组', exName: 'deptFormName', sort: 2 }, { name: '咨询师', exName: 'deptUserName', sort: 3 }, {
    name: '维度', exName: 'permision', sort: 4
  }, { name: '日期', exName: 'periodWid', sort: 5 }];

  public middleFileds = [{ name: '时间', exName: 'wid', sort: 0 }, { name: '咨询师', exName: 'userName', sort: 1 }];


  constructor(private requestHttp: RequestService, private customColumnDialogService: CustomColumnDialogService) { }

  setExportsParams(extraParams, columnData) {
    const costomMenu = [
      { name: '事业部名称', exName: 'deptDivisionName', sort: 0 },
      { name: '军团名称', exName: 'deptLegionName', sort: 1 },
      { name: '咨询组名称', exName: 'deptFormName', sort: 2 },
      { name: '咨询师', exName: 'deptUserName', sort: 3 },
      { name: '日期', exName: 'periodWid', sort: 4 },
    ];

    const allChildren = this.customColumnDialogService.filterSelectColoumn(columnData).allChildren;
    allChildren.forEach((item, index) => { costomMenu.push({ name: item.label, exName: item.value, sort: index + 5 }); });
    const params = Object.assign({}, { ...extraParams }, { costomMenu });
    return params;
  }

  /**
   * 网销效率指标统计导出
   * @param params 请求参数
   */
  exportNetSaleTargetPost(params = {}) {
    // return this.requestHttp.exportExcel('dms/flowExport/exportNetSaleTarget', params);
    return this.requestHttp.post('dms/excelExport/electDayWeekMonthExport', params);
  }



  /**
   * 获取前端军团
   * @param params 请求参数
   */
  getLegion(params = {}) {
    return this.requestHttp.post('dms/userDept/getLegion', params);
  }

  /**
   * 获取咨询师
   * @param params object  请求参数
   */
  getFrontUser(params = {}) {
    return this.requestHttp.post('dms/userDept/frontUser', params);
  }

  /**
   * 获取咨询组
   * @param params object  请求参数
   */
  getfrontGroup(params = {}) {
    return this.requestHttp.post('dms/userDept/frontGroup', params);
  }
}
