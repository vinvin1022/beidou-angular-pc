import { Component, OnInit, ElementRef, ViewChild, OnChanges, Input, OnDestroy, DoCheck, AfterViewInit } from '@angular/core';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { ReleaseMonitoringService } from '../../../service/release-monitoring.service';
import { FlowService } from '../../../service/flow.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { releaseMonitoringCustomFieldData } from '../../../service/release-monitoringCustomFieldData';
import { ReleaseDetailListComponent } from '../releaseDetailList/releaseDetailList.component';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { setFinalFilterData } from 'src/app/tools';


@Component({
  selector: 'app-subrelease-table',
  templateUrl: './subrelease-table.component.html',
  styleUrls: ['./subrelease-table.component.scss']
})
export class SubreleaseTableComponent implements OnInit, OnChanges, OnDestroy, DoCheck {

  public title: String = '自定义显示列';
  public customColumnData: Object = {};
  @Input() filterData: Object;
  @ViewChild('customColumnDialog', {static: false}) customColumnDialog: CustomColumnDialogComponent;
  @ViewChild('releaseDetailList', {static: false}) releaseDetailList: ReleaseDetailListComponent;
  public displayData: Array<any> = [];
  public filterFieldData: object = {};
  public flowViewReportParams = {};
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public loading: Boolean = false;
  public launchMonitor$;
  public flowDataType = '1';
  public newFlowDataType = '1';
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  public rowData: Object = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};




  public dataTable = [];
  constructor(private flowcommonformService: FlowcommonformService, private message: NzMessageService,
    private customColumnDialogService: CustomColumnDialogService, private commonCustomService: CommonCustomService,
    private releaseMonitoring: ReleaseMonitoringService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length   过滤掉电销或者网销字段
    // this.customColumnData = this.filterFlowDataType(this.customColumnDialogService.resetColumnData({ ...releaseMonitoringCustomFieldData }));
    this.flowcommonformService.flowDataType = this.flowDataType;
    this.setWidthScrollConfig();
    // this.getMenu();

  }
  ngOnChanges() {
    if (this.filterData) {
      this.submitOrReset();
    }
  }

  ngDoCheck() {
    if (this.flowDataType !== this.flowcommonformService.flowDataType) {
      this.flowDataType = this.flowcommonformService.flowDataType;
      // tslint:disable-next-line:max-line-length   过滤掉电销或者网销字段
      // this.customColumnData = this.filterFlowDataType(this.customColumnDialogService.resetColumnData({ ...releaseMonitoringCustomFieldData }));
      this.getMenu();
    }
  }

  getMenuParams() {
    const { path } = this.activatedRoute.routeConfig;
    this.getMenuMsgParams['menuId'] = path;
  }

  getMenu(fn?: Function) {
    this.getMenuParams();
    this.customColumnDialogService.getMenu(this.getMenuMsgParams).subscribe(res => {
      if (res.code === 200) {
        const customMenu = JSON.parse(res.result && res.result.customMenu);
        this.customMenu = customMenu || {};
        if (this.customMenu) {
          this.customColumnDialogService.columnData =
            this.customColumnData = this.customColumnDialogService.deleteProto(this.customMenu[this.flowDataType]);
          // tslint:disable-next-line:no-unused-expression
          fn && fn();
        } else {
          // this.customColumnDialogService.columnData = this.customColumnData;
        }
      }
    });
  }

  showDetailListModal(data) {
    this.rowData = data;
    this.releaseDetailList.showModal(this.rowData, this.filterFieldData, this.allChildren);
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
   * 设置查询参数
   */
  setFlowViewReportParams() {
    // this.flowViewReportParams = this.flowcommonformService.setFinalFilterData(this.filterData);
    this.flowViewReportParams = setFinalFilterData(this.filterData);
    this.flowViewReportParams['pageNo'] = this.pageIndex;
    this.flowViewReportParams['pageSize'] = this.pageSize;
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
      queryDimension: this.flowcommonformService.defaultFormData['queryDimension'],   // 时间类型范围值
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



  /**
   *  设置导出参数
   */
  getExportsParams = () => {
    const exportViewParams = {};
    const keys = ['pageNo', 'pageSize'];
    for (const key in this.flowViewReportParams) {
      if (this.flowViewReportParams.hasOwnProperty(key)) {
        if (!keys.includes(key)) {
          exportViewParams[key] = this.flowViewReportParams[key];
        }
      }
    }
    const costomMenu = [
      { name: '维度', exName: 'queryDimension', sort: 0 },
      { name: '时间', exName: 'periodWid', sort: 1 }
    ];
    const allChildren = this.customColumnDialogService.filterSelectColoumn(this.customColumnDialogService.columnData).allChildren;
    allChildren.forEach((item, index) => {
      costomMenu.push({
        name: item.label, exName: item.value, sort: index + 2
      });
    });

    const params = Object.assign({}, exportViewParams, { costomMenu });
    return params;
  }

  /**
   * 获取表格数据
   */
  setTableData(): void {
    this.getMenu(() => {
      this.newFlowDataType = this.flowDataType;
      this.loading = this.flowcommonformService.loading = true;
      this.setFlowViewReportParams();
      this.launchMonitor$ = this.releaseMonitoring.getGroupLaunchMonitor(this.flowViewReportParams).subscribe(res => {
        // this.getMenu(() => {this.getFilterField(this.customColumnData); });
        this.loading = this.flowcommonformService.loading = false;
        let newlist = [];
        if (res.result.list && res.result.list.length) {
          // newlist = this.flowService.yingshe(res.result.list, this.filterData);
          newlist = res.result.list;
        }
        this.displayData = this.commonCustomService.plusPercentageColomn([...newlist], this.releaseMonitoring.plusPercentage);
        this.total = res.result.total;
        this.getFilterField(this.customColumnDialogService.columnData);
      }, error => {
        this.loading = this.flowcommonformService.loading = false;
      });
    });

  }

  /**
   * 打开自定义列弹窗
   */
  showCustomColumnDialog() {
    this.getMenu(() => {
      this.customColumnDialog.showDialog(this.customMenu, this.flowDataType);
    });
  }

  serachData(data) {
    const filterData = this.filterData || { 'flowDataType': '1' };
    if (this.flowDataType !== filterData['flowDataType']) {
      return;
    }
    this.getFilterField(data);
  }
  /**
   * 获取自定义列过滤数据
   * @param data
   */
  getFilterField(data) {
    const newData = this.customColumnDialogService.filterSelectColoumn(data);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }

  setWidthScrollConfig() {
    if (this.displayData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['50px', '100px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }


  ngOnDestroy() {
    if (this.launchMonitor$) {
      this.launchMonitor$.unsubscribe();
    }
  }

}
