import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { OnlineStatisticsService } from '../../../service/online-statistics.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { OnlineDetailListComponent } from '../onlineDetailList/onlineDetailList.component';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ActivatedRoute } from '@angular/router';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { onlineStatisticsCustomFieldData } from '../../../service/onlineStatisticsCustomFieldData';


@Component({
  selector: 'app-subonline-table',
  templateUrl: './subonline-table.component.html',
  styleUrls: ['./subonline-table.component.scss']
})
export class SubonlineTableComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  public formData: object = {};
  @Input() searchData = {};
  @ViewChild('onlineDetailList', { static: false }) onlineDetailList: OnlineDetailListComponent;
  public loading = false;
  public onlineParams = {};
  public flowDataType = '1';
  public newFlowDataType = '1';
  public subscribeAll$ = {};
  public fieldKeys: Array<string> = [];
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  public customColumnData = {};
  public filterFieldData: object = {};
  public allChildren = [];
  public widthConfig: Array<string> = [];
  public scrollConfig = {};
  public bduploadFileUrl = 'dms/xiaoNeng/import/xiaoNengImport';
  tableTreeData = [];
  expandDataCache = {};


  constructor(private onlineStatistics: OnlineStatisticsService, private commonCustomService: CommonCustomService,
    private tableTreeService: TableTreeService, private activatedRoute: ActivatedRoute,
    private customColumnDialogService: CustomColumnDialogService) { }
  ngOnInit() {
    // this.getMenu();
    // this.getFilterField(this.customColumnData);
    this.setWidthScrollConfig();
  }

  ngOnChanges() {
    this.updateForm();
  }

  ngDoCheck() {
    if (this.flowDataType !== this.onlineStatistics.flowDataType) {
      this.flowDataType = this.onlineStatistics.flowDataType;
    }
  }

  download() {
    window.open(`https://sx-silk-bag.oss-cn-shenzhen.aliyuncs.com/file/xn_update.xlsx`);
  }

  /**
   * 搜索表单查询
   */
  updateForm() {
    // this.eventBusService.subscribMessage().subscribe(res => {
    this.formData = this.searchData;
    if (this.formData['dept']) {
      this.formData['deptId'] = this.formData['dept'];
    }
    this.getDivisonNetSaleData();
    // });
  }

  exportOnline() {
    this.onlineStatistics.exportOnline({ ...this.formData });
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
          this.customColumnData = this.customColumnDialogService.deleteProto(onlineStatisticsCustomFieldData);
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
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['160px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }


  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const exportViewParams = {};
    const costomMenu = [];
    for (const key in this.onlineParams) {
      if (this.onlineParams.hasOwnProperty(key)) {
        exportViewParams[key] = this.onlineParams[key];
      }
    }
    costomMenu.push({ name: '在线部门', exName: 'deptName', sort: 0 });
    costomMenu.push({ name: '咨询师', exName: 'userName', sort: 1 });
    costomMenu.push({ name: '日期', exName: 'periodWid', sort: 2 });
    const allChildren = this.allChildren;
    allChildren.forEach((item, index) => {
      costomMenu.push({
        name: item.label, exName: item.value, sort: index + 3
      });
    });

    const params = Object.assign({}, exportViewParams, { costomMenu });
    return params;
  }




  setTargetNetSaleParams() {
    this.onlineParams = Object.assign({}, this.formData);
  }

  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.getMenu(() => {
      this.newFlowDataType = this.flowDataType;
      this.loading = this.onlineStatistics.loading = true;
      this.setTargetNetSaleParams();
      const url = 'dms/view/groupDeptOnline';
      this.subscribeAll$['getDivisonNetSaleData$'] = this.onlineStatistics.getStatistics(url, this.onlineParams)
        .subscribe(res => {
          res.result = res.result.filter(item => item);
          this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
          this.initTreeTable();
          this.loading = this.onlineStatistics.loading = false;
          this.getFilterField(this.customColumnData);
        }, () => {
          this.loading = this.onlineStatistics.loading = false;
        });
    });
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}, url: string = 'dms/view/groupUserOnline') {
    const params = { queryValue: data['key'], ...this.onlineParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.onlineStatistics.loading = true;
      this.subscribeAll$['getDivisonNetSaleData$'] = this.onlineStatistics.getStatistics(url, params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.onlineStatistics.loading = false;
      });
    }
  }


  /**
   * 展开表格树形操作
   * @param array 参数
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    let url = 'dms/view/groupUserOnline';
    switch (data['level']) {
      case 0:
        url = 'dms/view/groupUserOnline';
        break;
    }
    this.getTableTreeData(data, url);
    this.tableTreeService.collapse(array, data, $event);
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.onlineStatistics;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }


  showDetail(rowData: object) {
    this.onlineDetailList.showModal(rowData, this.filterFieldData, this.allChildren);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.onlineStatistics.loading = false;
  }

}
