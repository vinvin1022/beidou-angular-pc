import { Component, OnInit, ElementRef, ViewChild, OnChanges, Input, OnDestroy, DoCheck } from '@angular/core';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { SalesTargetService } from '../../../service/sales-target.service';
import { setFinalFilterData } from 'src/app/tools';

@Component({
  selector: 'app-subsales-table',
  templateUrl: './subsales-table.component.html',
  styleUrls: ['./subsales-table.component.scss']
})
export class SubsalesTableComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input() filterData;
  public dataTable = [];
  public salesTargetParams: Object = {};
  public extensionTarget$;   // 存储subscribe
  public pageInfo2: Array<any> = [];
  public pageInfo1: Array<any> = [];
  public pageInfo1Title: Array<any> = [];
  public pageInfo2Title: Array<any> = [];
  public pageInfoLoading: Boolean = false;
  public nz1ScrollData: Object = {};
  public nz2ScrollData: Object = {};
  public nzWidthConfig1: Array<String> = [];
  public nzWidthConfig2: Array<String> = [];
  public pageInfo1List: Array<any> = [];
  public pageInfo2List: Array<any> = [];
  public flowDataType = '1';
  public newFlowDataType = '1';

  public percents = ['rate1', 'rate2', 'rate3', 'rate4', 'rate15', 'rate17', 'rate18', 'rate19', 'rate20'];


  constructor(private salesTargetService: SalesTargetService, private flowcommonformService: FlowcommonformService) { }


  ngOnChanges() {
    if (this.filterData) {
      this.submitOrReset();
    }
  }
  ngDoCheck() {
    if (this.flowDataType !== this.flowcommonformService.flowDataType) {
      this.flowDataType = this.flowcommonformService.flowDataType;
    }
  }

  /**
   * 设置查询参数
   */
  setsalesTargetParams() {
    this.salesTargetParams = setFinalFilterData(this.filterData);
  }

  ngOnInit(): void {
    this.flowcommonformService.flowDataType = this.flowDataType;
  }
  /**
   * 设置首次加载表格 请求默认值
   */
  setRequestData() {
    this.filterData = {
      menAreaCode: this.flowcommonformService.defaultFormData['menAreaCode'],   // 报名城市
      flowDataType: this.flowcommonformService.defaultFormData['flowDataType'],  // 业务模式
      flConsultingProject: this.flowcommonformService.defaultFormData['flConsultingProject'],  // 推广项目
      periodType: this.flowcommonformService.defaultFormData['periodType'],   // 时间类型
      rangePicker: this.flowcommonformService.defaultFormData['rangePicker']   // 时间类型范围值
    };
  }
  submitOrReset() {
    this._setDataTable();
  }


  /**
   * 导出
   */
  flowExportSale() {
    this.salesTargetService.flowExportSale({ ...this.salesTargetParams });
  }

  /**
   * 设置pageInfo1Title
   */
  _setPageInfoTitle(infoTable) {
    // const delVal = '合计';
    const titles = Object.values(infoTable[0]);
    // const index = titles.findIndex((item) => item === delVal);
    // titles.splice(index, 1);
    // titles.push(delVal);
    return titles;
  }
  /**
   * 转化为表格数据格式
   * @param pageInfoList Array
   */
  private _setPathInfoData(pageInfoList: Array<any> = []) {
    const len = pageInfoList.length;
    const tableField = {
      periodWid: { a0: '指标' },
      firstallotdAco: { a0: '首咨分配数（含自营）' },
      saleoppAco: { a0: '总销机（含自营）' },
      onlSaleoppAco: { a0: '在线销机' },
      mesSaleoppAco: { a0: '留言销机' },
      rate1: { a0: '总有效性（含自营）(%)' },
      rate2: { a0: '在线有效性(%)' },
      rate3: { a0: '留言有效性(%)' },
      revisitAco: { a0: '总回访（含自营）' },
      revisitAco7: { a0: '7日内回访数' },
      revisitAco14: { a0: '14日内回访数' },
      revisitAco15: { a0: '跨期回访数' },
      rate4: { a0: '7日内回访率(%)' },
      ordersAco: { a0: '总报名数（含自营）' },
      ordersAco7: { a0: '7日内报名数' },
      ordersAco14: { a0: '14日内报名数' },
      ordersAco15: { a0: '跨期报名数' },
      pcordersAco: { a0: '线上报名数' },
      ipadordersAco: { a0: '线下报名数' },
      rate17: { a0: '总销转（含自营）(%)' },
      rate18: { a0: '7日内销转(%)' },
      rate19: { a0: '14日内销转(%)' },
      rate20: { a0: '跨期销转(%)' },
      ordersAmo: { a0: '总流水（含自营）' },
      ordersAmo7: { a0: '7日内流水' },
      ordersAmo14: { a0: '14日内流水' },
      ordersAmo15: { a0: '跨期流水' },
      pcordersAmo: { a0: '线上流水' },
      ipadordersAmo: { a0: '线下流水' },
      rate5: { a0: 'ARPU（含自营）' },
      rate6: { a0: '7日内ARPU' },
      rate7: { a0: '14日内ARPU' },
      rate8: { a0: '跨期ARPU' },
      rate9: { a0: 'RPA（含自营）' },
      callAco: { a0: '拨打次数（含自营）' },
      effcallAco: { a0: '有效通话数（含自营）' },
      effcallTime: { a0: '有效通话时长（含自营）' },
      rate10: { a0: '人均拨打量' },
      effsitenumAco: { a0: '有效坐席' },
      rate11: { a0: '人均销机' },
      rate12: { a0: '人均回访' },
      rate13: { a0: '人均报名' },
      rate14: { a0: '人均流水' },
      resordersAco: { a0: '总预约单数' },
      resordersAco7: { a0: '7日内预约单数' },
      resordersAco14: { a0: '14日内预约单数' },
      resordersAco15: { a0: '跨期预约单数' },
      visitAco: { a0: '到访数' },
      rate15: { a0: '分校报名率(%)' },
    };
    // tableField['periodWid']['a' + (len + 1)] = '合计';
    if (this.flowDataType === '2') {
      tableField['rate1'] = { a0: '总加成率（含自营）(%)' };
      tableField['rate2'] = { a0: '在线加成率(%)' };
      tableField['rate3'] = { a0: '留言加成率(%)' };
      delete tableField['revisitAco'];  // 总回访（含自营）
      delete tableField['revisitAco7'];  // 7日内回访数
      delete tableField['revisitAco14'];  // 14日内回访数
      delete tableField['revisitAco15'];  // 跨期回访数
      delete tableField['rate4'];  // 7日内回访率
    }
    if (this.flowDataType === '1') {
      tableField['rate1'] = { a0: '总有效性（含自营）(%)' };
      tableField['rate2'] = { a0: '在线有效性(%)' };
      tableField['rate3'] = { a0: '留言有效性(%)' };
    }

    for (let index = 0; index < len; index++) {
      for (const key in pageInfoList[index]) {
        if (pageInfoList[index].hasOwnProperty(key)) {
          if (tableField[key]) {
            // const dNum = pageInfoList[index][key];

            // if (tableField[key]['a'] !== '指标') {    // 计算出合计
            //   if (!tableField[key]['a' + (len + 1)]) {
            //     tableField[key]['a' + (len + 1)] = 0;
            //   }
            //   if (dNum && typeof dNum === 'number') {
            //     tableField[key]['a' + (len + 1)] += dNum;
            //   }
            // }

            if ((pageInfoList[index][key] || pageInfoList[index][key] === 0) && this.percents.includes(key)) {
              tableField[key]['a' + (index + 1)] = pageInfoList[index][key].toFixed(2) + '%';
            } else {
              tableField[key]['a' + (index + 1)] = pageInfoList[index][key];
            }
            // tableField[key]['a' + (index + 1)] = pageInfoList[index][key];
          }
        }
      }
    }
    // this.amountToFixed(tableField, len);
    const arr = Object.values(tableField);
    return arr;
  }

  /**
   * 处理合计数据
   * @param disposeObj Object 处理的对象
   * @param len Number
   */
  amountToFixed(disposeObj, len) {
    for (const key in disposeObj) {
      if (disposeObj.hasOwnProperty(key)) {
        if (disposeObj[key]['a' + (len + 1)] === 0) {
          disposeObj[key]['a' + (len + 1)] = null;
        }

        if (this.percents.includes(key) && typeof disposeObj[key]['a' + (len + 1)] === 'number') {
          disposeObj[key]['a' + (len + 1)] = (disposeObj[key]['a' + (len + 1)] / len).toFixed(2) + '%';
        } else if (typeof disposeObj[key]['a' + (len + 1)] === 'number') {
          disposeObj[key]['a' + (len + 1)] = (disposeObj[key]['a' + (len + 1)]).toFixed(2);
        }
      }
    }
  }

  /**
   * 获取表格数据
   */
  _setDataTable(): void {
    this.newFlowDataType = this.flowDataType;
    this.pageInfoLoading = this.flowcommonformService.loading = true;
    this.setsalesTargetParams();
    this.extensionTarget$ = this.salesTargetService.getSaleTarget(this.salesTargetParams).subscribe(res => {
      if (res.result && res.result.pageInfo1 && res.result.pageInfo1.length) {
        const pageInfo1List = (res.result && res.result.pageInfo1) || [];
        const info1Table = this._setPathInfoData(pageInfo1List);
        this.pageInfo1List = pageInfo1List;
        this.pageInfo1Title = this._setPageInfoTitle(info1Table);
        this.nz1ScrollData = { x: `${(this.pageInfo1Title.length - 1) * 100 + 170}px` };
        this.nzWidthConfig1 = this.setTdWith(this.pageInfo1Title);
        this.pageInfo1 = info1Table.filter((value, index) => index !== 0);
      } else {
        this.pageInfo1 = [];
        this.pageInfo2Title = [];
        this.nzWidthConfig1 = [];
      }

      if (res.result && res.result.pageInfo2 && res.result.pageInfo2.length) {
        const pageInfo2List = (res.result && res.result.pageInfo2) || [];
        const info2Table = this._setPathInfoData(pageInfo2List);
        this.pageInfo2List = pageInfo2List;
        this.pageInfo2Title = this._setPageInfoTitle(info2Table);
        this.nz2ScrollData = { x: `${(this.pageInfo2Title.length - 1) * 100 + 170}px` };
        this.nzWidthConfig2 = this.setTdWith(this.pageInfo2Title);
        this.pageInfo2 = info2Table.filter((value, index) => index !== 0);
      } else {
        this.pageInfo2 = [];
        this.pageInfo2Title = [];
        this.nzWidthConfig2 = [];
      }
      this.pageInfoLoading = this.flowcommonformService.loading = false;
    }, error => {
      this.pageInfoLoading = this.flowcommonformService.loading = false;
    });
  }

  setTdWith(pageInfoTitle) {
    const nzWidthConfig = ['170px'];
    for (let index = 1; index < pageInfoTitle.length; index++) {
      nzWidthConfig.push('100px');
    }
    return nzWidthConfig;
  }

  ngOnDestroy() {
    if (this.extensionTarget$) {
      this.extensionTarget$.unsubscribe();
    }
    this.flowcommonformService.loading = false;
  }
}
