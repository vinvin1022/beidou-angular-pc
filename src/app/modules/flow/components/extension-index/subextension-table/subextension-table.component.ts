import { Component, OnInit, OnChanges, Input, OnDestroy, DoCheck } from '@angular/core';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { ExtensionIndexService } from '../../../service/extension-index.service';
import { setFinalFilterData } from 'src/app/tools';


@Component({
  selector: 'app-subextension-table',
  templateUrl: './subextension-table.component.html',
  styleUrls: ['./subextension-table.component.scss']
})
export class SubextensionTableComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input() filterData;
  public extensionIndexParams: Object = {};
  public extensionTarget$;   // 存储subscribe
  public pageInfo2: Array<any> = [];
  public pageInfo1: Array<any> = [];
  public pageInfo1Title: Array<any> = [];
  public pageInfo2Title: Array<any> = [];
  public nz1ScrollData: Object = {};
  public nz2ScrollData: Object = {};
  public pageInfo1List: Array<any> = [];
  public pageInfo2List: Array<any> = [];
  public nzWidthConfig1: Array<any> = [];
  public nzWidthConfig2: Array<any> = [];

  public pageInfoLoading: Boolean = false;
  public flowDataType = '1';
  public newFlowDataType = '1';
  public percents = ['rate1', 'rate12', 'rate4', 'rate5', 'rate6', 'rate9', 'rate15', 'rate10', 'rate13', 'rate20', 'rate21', 'rate22'];


  constructor(private extensionIndexService: ExtensionIndexService, private flowcommonformService: FlowcommonformService) { }


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
  setextensionIndexParams() {
    // this.extensionIndexParams = this.flowcommonformService.setFinalFilterData(this.filterData);
    this.extensionIndexParams = setFinalFilterData(this.filterData);

  }

  ngOnInit(): void {
    // this.flowcommonformService.flowDataType = this.flowDataType =
    //   this.flowcommonformService.formateFlowDataType(this.flowcommonformService.defaultFormData.flowDataType)['optionName'];
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
  flowExportExportExtension() {
    this.extensionIndexService.flowExportExportExtension({ ...this.extensionIndexParams });
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
      rate1: { a0: '总费比(%)' },
      ordersAmo: { a0: '总流水' },
      ordersAmo7: { a0: '7日内流水' },
      flowidAco: { a0: '总名片数' },
      rate15: { a0: '在线占比(%)' },
      rate2: { a0: '名片成本' },
      saleoppAco: { a0: '总销机' },
      rate3: { a0: 'CPA' },
      rate4: { a0: '总有效性(%)' },
      rate5: { a0: '在线有效性(%)' },
      rate6: { a0: '留言有效性(%)' },
      rate7: { a0: 'RPC' },
      rate8: { a0: 'RPA' },
      rate9: { a0: '报名率(%)' },
      rate10: { a0: '总销转(%)' },
      rate20: { a0: '7日内销转(%)' },
      rate21: { a0: '在线销转(%)' },
      rate22: { a0: '留言销转(%)' },
      rate14: { a0: 'ARPU' },
      ordersAco: { a0: '总报名数' },
      ordersAco7: { a0: '7日内报名数' },
      financeAmount: { a0: '财务消费' },
      paperAmount: { a0: '账面消费' },
      num: { a0: '展现量' },
      click: { a0: '点击数' },
      rate12: { a0: 'CTR(%)' },
      rate11: { a0: 'CPC' },
      rate13: { a0: '网电(%)' }
    };

    // tableField['periodWid']['a' + (len + 1)] = '合计';
    if (this.flowDataType === '1') {
      tableField['rate4'] = { a0: '总有效性(%)' };
      tableField['rate5'] = { a0: '在线有效性(%)' };
      tableField['rate6'] = { a0: '留言有效性(%)' };
    }
    if (this.flowDataType === '2') {
      tableField['rate4'] = { a0: '加成率(%)' };
      tableField['rate5'] = { a0: '在线加成率(%)' };
      tableField['rate6'] = { a0: '留言加成率(%)' };
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
        const lastNum = disposeObj[key]['a' + (len + 1)];
        if (this.percents.includes(key) && typeof lastNum === 'number') {
          disposeObj[key]['a' + (len + 1)] = (lastNum / len).toFixed(2) + '%';
        } else if (typeof disposeObj[key]['a' + (len + 1)] === 'number') {
          disposeObj[key]['a' + (len + 1)] = lastNum.toFixed(2);
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
    this.setextensionIndexParams();
    this.extensionTarget$ = this.extensionIndexService.getExtensionTarget(this.extensionIndexParams).subscribe(res => {
      if (res.result && res.result.pageInfo1 && res.result.pageInfo1.length) {
        const pageInfo1List = (res.result && res.result.pageInfo1) || [];
        const info1Table = this._setPathInfoData(pageInfo1List);

        this.pageInfo1List = pageInfo1List;
        this.pageInfo1Title = this._setPageInfoTitle(info1Table);
        this.nz1ScrollData = { x: `${(pageInfo1List.length - 1) * 100 + 170}px` };
        this.pageInfo1 = info1Table.filter((value, index) => index !== 0);
        this.nzWidthConfig1 = this.setTdWith(this.pageInfo2Title);
      } else {
        this.pageInfo1 = [];
        this.pageInfo1Title = [];
        this.nzWidthConfig1 = [];
      }


      if (res.result && res.result.pageInfo2 && res.result.pageInfo2.length) {
        const pageInfo2List = (res.result && res.result.pageInfo2) || [];
        const info2Table = this._setPathInfoData(pageInfo2List);
        this.pageInfo2List = pageInfo2List;
        this.pageInfo2Title = this._setPageInfoTitle(info2Table);
        this.nz2ScrollData = { x: `${(pageInfo2List.length - 1) * 100 + 170}px` };
        this.pageInfo2 = info2Table.filter((value, index) => index !== 0);
        this.nzWidthConfig2 = this.setTdWith(this.pageInfo2Title);
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
  }
}
