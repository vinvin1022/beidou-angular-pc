import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { ElectricstatisticsService } from '../../../service/electricstatistics.service';
import { MoreformService } from '../../../service/moreform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { ElstatDetailListComponent } from '../elstatdetailList/elstatdetailList.component';

import { ActivatedRoute } from '@angular/router';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { electricStatisticsFieldData } from '../../../service/electric-statisticsFieldData';
import { FrontendService } from '../../../service/frontend.service';
import { setFinalFilterData } from 'src/app/tools';

@Component({
  selector: 'app-subelectricstat-table',
  templateUrl: './subelectricstat-table.component.html',
  styleUrls: ['./subelectricstat-table.component.scss']
})
export class SubelectricstatTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  @ViewChild('elstatDetailList', { static: false }) elstatDetailList: ElstatDetailListComponent;

  public customColumnData: Object = {};


  public dataTable = [];
  public flowDataType = '1';
  public loading = false;
  // public pageIndex: Number = 1;
  // public pageSize: Number = 10;
  // public total: Number = 1;
  public electricityCardParams = {};
  public subscribeAll$ = {};
  public widthConfig: Array<string> = [];
  public scrollConfig: object = {};
  public fieldKeys: Array<string> = [];
  public filterFieldData: object = {};
  public allChildren = [];

  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  tableTreeData = [];
  expandDataCache = {};
  constructor(private electricstatisticsService: ElectricstatisticsService, private moreformService: MoreformService,
    private activatedRoute: ActivatedRoute, private customColumnDialogService: CustomColumnDialogService,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService,
    private frontendService: FrontendService) { }

  ngOnChanges() {
    if (this.filterData) {
      // this.pageIndex = 1;
      // this.pageSize = 10;
      this.getTargetDivision();
    }
  }
  ngOnInit() {
    // this.getMenu();
    this.setWidthScrollConfig();
  }
  getMenuParams() {
    const { path } = this.activatedRoute.routeConfig;
    this.getMenuMsgParams['menuId'] = path;
  }

  getMenu(fn?: () => void) {
    this.getMenuParams();
    this.customColumnDialogService.getMenu(this.getMenuMsgParams).subscribe(res => {
      if (res.code === 200) {
        const customMenu = JSON.parse(res.result && res.result.customMenu);
        this.customMenu = customMenu || {};
        if (customMenu && customMenu[this.flowDataType]) {
          this.customColumnData = this.customColumnDialogService.deleteProto(customMenu[this.flowDataType]);
          // tslint:disable-next-line:no-unused-expression
          fn && fn();
        } else {
          this.customColumnData = this.customColumnDialogService.deleteProto(electricStatisticsFieldData);
        }
      }
    });
  }


  /**
   * 获取自定义列过滤数据
   * @param data 请求参数
   */
  getFilterField(data) {
    const newData = this.customColumnDialogService.filterSelectColoumn(data);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }

  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['230px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  // pageIndexChange(pageIndex) {
  //   this.getElectricityCard();
  // }
  // pageSizeChange(pageSize) {
  //   this.pageIndex = 1;
  //   this.getElectricityCard();
  // }

  // /**
  //  * 获取表格数据
  //  */
  // getElectricityCard() {
  //   this.loading = this.moreformService.loading = true;
  //   this.setElectricityParams();
  //   this.subscribeAll$['getElectricityCard$'] = this.electricstatisticsService.getElectricityCard(this.electricityCardParams)
  //     .subscribe(res => {
  //       this.dataTable = this.commonCustomService.plusPercentageColomn(res.result && res.result.list || [],
  //         this.electricstatisticsService.plusPercentage);
  //       this.total = res.result && res.result.total;
  //       this.loading = this.moreformService.loading = false;
  //     }, () => {
  //       this.loading = this.moreformService.loading = false;
  //     });
  // }

  /**
   * 设置查询参数
   */
  setElectricityParams() {
    this.electricityCardParams = setFinalFilterData(this.filterData);
    // this.electricityCardParams = Object.assign({}, params, {
    //   pageNo: this.pageIndex,
    //   pageSize: this.pageSize
    // });
  }


  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const costomMenu = [];
    const staticFileds = this.frontendService.staticFileds;
    costomMenu.push(...staticFileds);
    const allChildren = this.allChildren;
    allChildren.forEach((item, index) => {
      costomMenu.push({
        name: item.label, exName: item.value, sort: index + staticFileds.length
      });
    });

    const params = Object.assign({}, this.electricityCardParams, { costomMenu });
    return params;
  }





  /**
   * 获取表格合计数据
   */
  getTargetDivision() {
    this.getMenu(() => {
      this.loading = this.moreformService.loading = true;
      this.setElectricityParams();
      const tmpParams = { ...this.electricityCardParams };
      delete tmpParams['groupDimension'];
      this.subscribeAll$['getDayGroupDivision$'] =
        this.electricstatisticsService.getTargetDivision(tmpParams).subscribe(res => {
          // this.setWidthScrollConfig();
          this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
          this.initTreeTable();
          this.loading = this.moreformService.loading = false;
          this.getFilterField(this.customColumnData);
        }, () => {
          this.loading = this.moreformService.loading = false;
        });
    });
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}, methodName: string = 'getTargetDimension') {
    const params = { queryValue: data['userId'], ...this.electricityCardParams, ...this.tableTreeService._getdlist(data) };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.moreformService.loading = true;
      this.subscribeAll$[`${methodName}$`] = this.electricstatisticsService[methodName](params).subscribe(res => {
        this.setWidthScrollConfig();
        // this.total = res.result && res.result.total;
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.moreformService.loading = false;
      });
    }
  }

  /**
   * 展开表格树形操作
   * @param array 请求数组
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    let methodName = 'getTargetDimension';
    if (data['level'] === 0) {
      methodName = 'getTargetDimension';
    }
    this.getTableTreeData(data, methodName);
    this.tableTreeService.collapse(array, data, $event);
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.electricstatisticsService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  showDetail(rowData: object) {
    this.elstatDetailList.showModal(rowData, this.filterFieldData, this.allChildren);
  }


  /**
   * 电销名片统计导出
   */
  exportElectCark() {
    this.electricstatisticsService.exportElectCark({ ...this.electricityCardParams });
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.moreformService.loading = false;
  }
}
