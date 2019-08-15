import { Component, OnInit, ElementRef, ViewChild, OnChanges, AfterViewInit, Input, OnDestroy, DoCheck } from '@angular/core';

import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { GeneralIntroductionService } from '../../../service/general-introduction.service';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { FlowService } from '../../../service/flow.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DetailListComponent } from '../detailList/detailList.component';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { generalIntroductionCustomFieldData } from '../../../service/general-introductionCustomFieldData';
import { setFinalFilterData } from 'src/app/tools';

interface FilterFieldData {
  stream?: { children: Array<any>, name: any };
  businessCard?: { children: Array<any>, name: any };
  pinMachine?: { children: Array<any>, name: any };
  pinRotation?: { children: Array<any>, name: any };
  enlist?: { children: Array<any>, name: any };
  pointElimination?: { children: Array<any>, name: any };
}
@Component({
  selector: 'app-subgeneral-table',
  templateUrl: './subgeneral-table.component.html',
  styleUrls: ['./subgeneral-table.component.scss']
})

export class SubgeneralTableComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input() filterData: object;
  @ViewChild('customColumnDialog', { static: false }) customColumnDialog: CustomColumnDialogComponent;
  @ViewChild('detailList', { static: false }) detailList: DetailListComponent;
  public title = '自定义显示列';
  public customColumnData: object = {};
  public displayData: Array<any> = [];
  public filterFieldData: FilterFieldData;
  public flowViewReportParams = {};
  public pageIndex = 1;
  public pageSize = 10;
  public total = 0;
  public loading = false;
  public flowViewReport$;
  public flowDataType = '电销';
  public newFlowDataType = '电销';

  public rowData: object = {};
  public allChildren = {};
  public nzWidthConfig: Array<string> = [
    '50px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'];
  public nzScroll: object = { x: '5350px', y: '500px' };


  constructor(private generalIntroduction: GeneralIntroductionService,
    private flowService: FlowService, private commonCustomService: CommonCustomService,
    private flowcommonformService: FlowcommonformService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.submitOrReset();
    }
  }

  ngDoCheck() {
    if (this.flowDataType !== this.flowcommonformService.flowDataType) {
      this.flowDataType = this.flowcommonformService.flowDataType;
      this.customColumnData = this.filterFlowDataType(generalIntroductionCustomFieldData);  // 设置自定义列
    }
  }

  showDetailListModal(data) {
    this.rowData = data;
    this.detailList.showModal(this.rowData);
  }

  /**
   * 设置查询参数
   */
  setFlowViewReportParams() {
    // this.flowViewReportParams = this.flowcommonformService.setFinalFilterData(this.filterData);
    this.flowViewReportParams = setFinalFilterData(this.filterData);

    this.flowViewReportParams['pageNo'] = this.pageIndex;
    this.flowViewReportParams['pageSize'] = this.pageSize;
  }

  ngOnInit(): void {
    this.customColumnData = this.filterFlowDataType(generalIntroductionCustomFieldData);
    this.flowcommonformService.flowDataType = this.flowDataType =
      this.flowcommonformService.formateFlowDataType(this.flowcommonformService.defaultFormData.flowDataType)['optionName'];
  }


  /**
   * 过滤电销或者网销字段
   * @param customColumnData object
   */
  filterFlowDataType(customColumnData: object) {
    const tmpObj = {};
    for (const pkey in customColumnData) {
      if (customColumnData.hasOwnProperty(pkey)) {
        const pelement = customColumnData[pkey];
        tmpObj[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              tmpObj[pkey][mkey] = melement;
            } else {
              const newChildren = melement.filter(item => !item.type || (item.type === this.flowDataType));
              tmpObj[pkey][mkey] = newChildren;
            }
          }
        }
      }
    }
    return tmpObj;
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
      rangePicker: this.flowcommonformService.defaultFormData['rangePicker'],   // 时间类型范围值
      queryDimension: this.flowcommonformService.defaultFormData['queryDimension'],   // 维度
    };
  }
  submitOrReset() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.setTableData();
  }

  pageIndexChange(pageIndex) {
    this.setTableData();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.setTableData();
  }

  generalIntroductionExportView() {
    const exportViewParams = {};
    const keys = ['pageNo', 'pageSize', 'dimensionValue'];
    for (const key in this.flowViewReportParams) {
      if (this.flowViewReportParams.hasOwnProperty(key)) {
        if (!keys.includes(key)) {
          exportViewParams[key] = this.flowViewReportParams[key];
        }
      }
    }
    this.generalIntroduction.generalIntroductionExportView(exportViewParams);
  }



  /**
   * 获取表格数据
   */
  setTableData(): void {
    this.newFlowDataType = this.flowDataType;
    this.loading = this.flowcommonformService.loading = true;
    this.setFlowViewReportParams();
    const flowViewReportParams$ = this.generalIntroduction.reportSummary(this.flowViewReportParams).pipe(map(item => {
      item['result']['list'][0]['dimension'] = '合计';
      return item;
    }));
    const flowViewReport$ = this.generalIntroduction.flowViewReport(this.flowViewReportParams);
    forkJoin(flowViewReportParams$, flowViewReport$).pipe(map(idata => {
      let total = 0;
      const dataList = [];
      idata.forEach(item => {
        total += item.result.total;
        dataList.push(...item.result.list);
      });
      return { total, dataList };
    })).subscribe(res => {
      this.customColumnDialog.handleOk(this.customColumnData);
      this.total = res.total;
      this.displayData = this.commonCustomService.plusPercentageColomn(res.dataList, this.generalIntroduction.plusPercentage);
      this.loading = this.flowcommonformService.loading = false;
    }, error => {
      this.loading = this.flowcommonformService.loading = false;
    });
  }


  /**
   * 打开自定义列弹窗
   */
  showCustomColumnDialog() {
    this.customColumnDialog.showDialog(this.customColumnData);
  }

  /**
   *  获取自定义列过滤数据
   * @param data 参数
   */
  getFilterField(data) {
    const newData = this.filterSelectColoumn(data);
    this.filterFieldData = newData.selectField;
    this.allChildren = newData.allChildren;
    this.nzWidthConfig = this.setTdWith(newData.allChildren);
    this.nzScroll = { x: `${(this.nzWidthConfig.length - 1) * 100 + 150}px`, y: '500px' };
  }


  /**
   * 筛选选中字段
   * @param customColumnData object
   */
  filterSelectColoumn(customColumnData: object) {
    const selectField = {};
    const allChildren = [];
    for (const pkey in customColumnData) {
      if (customColumnData.hasOwnProperty(pkey)) {
        const pelement = customColumnData[pkey];
        selectField[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              selectField[pkey][mkey] = melement;
            } else {
              const newChildren = melement.filter(item => item.checked);
              selectField[pkey][mkey] = newChildren;
              allChildren.push(...newChildren);
            }
          }
        }
      }
    }
    return { selectField, allChildren };
  }

  setTdWith(pageInfoTitle) {
    const nzWidthConfig = ['50px', '100px'];
    pageInfoTitle.forEach(() => {
      nzWidthConfig.push('100px');
    });
    return nzWidthConfig;
  }

  ngOnDestroy() {
    if (this.flowViewReport$) {
      this.flowViewReport$.unsubscribe();
    }
  }
}
