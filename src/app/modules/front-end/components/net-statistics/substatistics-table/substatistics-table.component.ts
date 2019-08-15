import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';

import { NetstatisticsService } from '../../../service/netstatistics.service';

import { MoreformService } from '../../../service/moreform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { NetstatDetailListComponent } from '../netstatdetailList/netstatdetailList.component';

import { ActivatedRoute } from '@angular/router';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { netStatisticsFieldData } from '../../../service/netStatisticscolFieldData';
import { FrontendService } from '../../../service/frontend.service';
import { setFinalFilterData } from 'src/app/tools';


@Component({
  selector: 'app-substatistics-table',
  templateUrl: './substatistics-table.component.html',
  styleUrls: ['./substatistics-table.component.scss']
})
export class SubstatisticsTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  @ViewChild('netstatdetailList', { static: false }) netstatdetailList: NetstatDetailListComponent;

  public customColumnData: object = {};
  public dataTable = [];
  public fieldKeys: Array<string> = [];
  public loading = false;
  public flowDataType = '1';
  public subscribeAll$: object = {};
  public netSaleProjectParams: object = {};

  public filterFieldData: object = {};
  public allChildren = [];
  public widthConfig = [];
  public scrollConfig: object = { x: '1000px', y: '500px' };
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  tableTreeData = [];
  expandDataCache = {};
  constructor(private netstatisticsService: NetstatisticsService, private moreformService: MoreformService,
    private commonCustomService: CommonCustomService, private activatedRoute: ActivatedRoute,
    private tableTreeService: TableTreeService, private customColumnDialogService: CustomColumnDialogService,
    private frontendService: FrontendService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getDivisionSaleProject();
    }
  }
  ngOnInit() {
    // this.setWidthConfig();
    this.setWidthScrollConfig();
    // this.getMenu();
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
          this.customColumnData = this.customColumnDialogService.deleteProto(netStatisticsFieldData);
        }
        // this.getFilterField(this.customColumnData);
      }
    });
  }


  /**
   * 获取自定义列过滤数据
   * @param data 参数
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

  /**
   * 获取表格数据
   */
  getNetSaleProject() {
    this.getMenu();
    this.loading = this.moreformService.loading = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$['getNetSaleProject$'] = this.netstatisticsService.getNetSaleProject(this.netSaleProjectParams).subscribe(res => {
      this.getFilterField(this.customColumnData);
      this.dataTable = this.commonCustomService.plusPercentageColomn(res.result && res.result.list || [],
        this.netstatisticsService.plusPercentage);
      this.loading = this.moreformService.loading = false;
    }, () => {
      this.loading = this.moreformService.loading = false;
    });
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

    const params = Object.assign({}, this.netSaleProjectParams, { costomMenu });
    return params;
  }

  /**
   * 设置getTargetNetSale() 参数
   */
  setTargetNetSaleParams() {
    this.netSaleProjectParams = setFinalFilterData(this.filterData);
  }



  /**
   * 获取表格合计数据
   */
  getDivisionSaleProject() {
    this.getMenu(() => {
      this.loading = this.moreformService.loading = true;
      this.setTargetNetSaleParams();
      const tmpParams = { ...this.netSaleProjectParams };
      delete tmpParams['groupDimension'];
      this.subscribeAll$['getDayGroupDivision$'] =
        this.netstatisticsService.getDivisionSaleProject('dms/frond/divisionSaleProject', tmpParams).subscribe(res => {
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
  getTableTreeData(data: object = {}, url: string = 'getTargetDimension') {
    const params = { queryValue: data['userId'], ...this.netSaleProjectParams, ...this.tableTreeService._getdlist(data) };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.moreformService.loading = true;
      this.subscribeAll$['getDivisionSaleProject$'] = this.netstatisticsService.getDivisionSaleProject(url, params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.moreformService.loading = false;
      });
    }
  }

  /**
   * 展开表格树形操作
   * @param array
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    const url = 'dms/frond/dimensionSaleProject';
    this.getTableTreeData(data, url);
    this.tableTreeService.collapse(array, data, $event);
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.netstatisticsService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  showDetail(rowData: object = {}) {
    this.netstatdetailList.showModal(rowData, this.filterFieldData, this.allChildren);
  }



  /**
   * 网销效率指标统计导出
   */
  exportNetSaleProject() {
    this.netstatisticsService.exportNetSaleProject({ ...this.netSaleProjectParams });
  }




  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.moreformService.loading = false;

  }

}
