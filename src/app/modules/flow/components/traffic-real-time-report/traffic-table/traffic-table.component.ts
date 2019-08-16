import { Component, OnInit, ElementRef, ViewChild, OnChanges, AfterViewInit, Input, OnDestroy, DoCheck } from '@angular/core';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { TrafficRealTimeReportService } from '../../../service/traffic-real-time-report.service';
import { trafficRealTimeReportCustomFieldData } from '../../../service/traffic-real-time-reportCustomFieldData';


@Component({
  selector: 'app-traffic-table',
  templateUrl: './traffic-table.component.html',
  styleUrls: ['./traffic-table.component.scss']
})
export class TrafficTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData: object = {};
  public customColumnData: object = {};
  public displayData: Array<any> = [];
  public filterFieldData = {};
  public flowViewReportParams: object = { range: '1' };
  public loading = false;
  public flowViewReport$;
  public subscribeAll$: object = {};
  public rowData: object = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];

  public widthConfig: Array<string> = [];
  public scrollConfig: object = {};
  public exportsParams = {};
  public sortParams = {};

  tableTreeData = [];
  expandDataCache = {};


  constructor(private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService,
    private customColumnDialogService: CustomColumnDialogService, private trafficRealTimeReportService: TrafficRealTimeReportService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.setTableData();
    }
  }

  ngOnInit(): void {
    this.setWidthScrollConfig();
  }

  /**
   * 设置查询参数
   */
  setFlowViewReportParams() {
    this.flowViewReportParams = Object.assign({}, this.filterData);
    if (this.flowViewReportParams['divisionList'] && this.flowViewReportParams['divisionList'].length) {
      this.flowViewReportParams['range'] = 0;
    } else {
      this.flowViewReportParams['range'] = 1;
    }

    if (this.sortParams['key'] && this.sortParams['value']) {
      this.flowViewReportParams['orderByCode'] = this.sortParams['key'] + ' ' + this.sortParams['value'].replace(/end/, '');
    }

    this.exportsParams = Object.assign({}, this.flowViewReportParams);
  }




  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    return Object.assign({}, this.exportsParams, { range: 3 });
  }

  /**
   * 获取表格数据
   */
  setTableData() {
    this.loading = this.trafficRealTimeReportService.loading = true;
    this.setFlowViewReportParams();
    this.flowViewReport$ = this.trafficRealTimeReportService.getQueryFlowRealTime(this.flowViewReportParams).subscribe(res => {
      this.loading = this.trafficRealTimeReportService.loading = false;
      res.result = res.result || [];
      this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
      this.initTreeTable();
      this.getFilterField();
    }, error => {
      this.loading = this.trafficRealTimeReportService.loading = false;
    });
  }


  /**
   * 获取自定义列过滤数据
   */
  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(trafficRealTimeReportCustomFieldData);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }

  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['230px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}, methodName: string = 'getQueryFlowRealTime') {
    const params = { ...this.flowViewReportParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.trafficRealTimeReportService.loading = true;
      this.subscribeAll$[`${methodName}$`] = this.trafficRealTimeReportService[methodName](params).subscribe(res => {
        res.result = res.result || [];
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.trafficRealTimeReportService.loading = false;
      }, err => {
        this.loading = this.trafficRealTimeReportService.loading = false;
      });
    }
  }


  /**
   * 展开表格树形操作
   * @param array 參數
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    const methodName = 'getQueryFlowRealTime';
    this._collapseParams(data);
    this.getTableTreeData(data, methodName);
    this.tableTreeService.collapse(array, data, $event);
  }

  private _collapseParams(data: object): void {
    this.flowViewReportParams = Object.assign({}, this.filterData);
    if (this.flowViewReportParams['divisionList'] && this.flowViewReportParams['divisionList'].length) {
      this.flowViewReportParams['range'] = data['level'] + 1;
      if (data['level'] === 0) {
        this.flowViewReportParams['divisionList'] = [data['divisionId']];
      }
      if (data['level'] === 1) {
        this.flowViewReportParams['dept1List'] = [data['deptId1']];
        this.flowViewReportParams['divisionList'] = [data['divisionId']];
      }
      if (data['level'] === 2) {
        this.flowViewReportParams['dept2List'] = [data['deptId2']];
        this.flowViewReportParams['dept1List'] = [data['deptId1']];
        this.flowViewReportParams['divisionList'] = [data['divisionId']];
      }
    } else {
      this.flowViewReportParams['range'] = data['level'] + 2;
      delete this.flowViewReportParams['divisionList'];
      if (data['level'] === 0) {
        this.flowViewReportParams['dept1List'] = [data['deptId1']];
      }
      if (data['level'] === 1) {
        this.flowViewReportParams['dept2List'] = [data['deptId2']];
        this.flowViewReportParams['dept1List'] = [data['deptId1']];
      }
    }
    if (this.sortParams['key'] && this.sortParams['value']) {
      this.flowViewReportParams['orderByCode'] = this.sortParams['key'] + ' ' + this.sortParams['value'].replace(/end/, '');
    }


  }

  sort(sort: { key: string; value: string }): void {
    this.sortParams = sort;
    this.setTableData();
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data?: object): void {
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, this.trafficRealTimeReportService.plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    if (this.flowViewReport$) {
      this.flowViewReport$.unsubscribe();
    }
  }
}
