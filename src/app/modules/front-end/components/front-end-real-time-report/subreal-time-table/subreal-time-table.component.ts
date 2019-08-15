import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { FrontendService } from '../../../service/frontend.service';
import { frontRealReportCustomFieldData } from '../../../service/front-realCustomFieldData';
import { FrontRealFormService } from '../../../service/front-real-form.service';
import { FrontRealReportService } from '../../../service/front-real-report.service';


@Component({
  selector: 'app-subreal-time-table',
  templateUrl: './subreal-time-table.component.html',
  styleUrls: ['./subreal-time-table.component.scss']
})
export class SubrealTimeTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public customColumnData: Object = {};
  public filterFieldData;
  public loading: Boolean = false;
  public subscribeAll$: Object = {};
  public targetNetSaleParams: Object = {};
  public exportsParams: Object = {};

  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};
  public sortParams = {};

  tableTreeData = [];
  expandDataCache = {};
  constructor(private frontRealReportService: FrontRealReportService, private frontRealFormService: FrontRealFormService,
    private customColumnDialogService: CustomColumnDialogService,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getDivisonNetSaleData();
    }
  }
  ngOnInit() {
    this.setWidthScrollConfig();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortParams = sort;
    this.getDivisonNetSaleData();
  }



  /**
  * 获取自定义列过滤数据
  * @param data
  */
  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(frontRealReportCustomFieldData);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }


  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length,
        ['230px'], '108px');
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  /**
   * 设置getTargetNetSale() 参数
   */
  setTargetNetSaleParams() {
    this.targetNetSaleParams = Object.assign({}, this.filterData);
    this.targetNetSaleParams['range'] = 1;
    if (this.sortParams['key'] && this.sortParams['value']) {
      this.targetNetSaleParams['orderByCode'] = this.sortParams['key'] + ' ' + this.sortParams['value'].replace(/end/, '');
    }
    this.exportsParams = { ...this.targetNetSaleParams };
  }



  /**
   * 实时导出
   */
  exportsFile() {
    this.exportsParams['range'] = 5;
    this.frontRealReportService.savefrontACTQueryVO(this.exportsParams).subscribe(res => {
      this.frontRealReportService.exportFrontACT({ ridesKey: res.result });
    });
  }





  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.loading = this.frontRealFormService.loading = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$['queryFrontACT$'] = this.frontRealReportService.queryFrontACT(this.targetNetSaleParams)
      .subscribe(res => {
        this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
        this.initTreeTable();
        this.loading = this.frontRealFormService.loading = false;
        this.getFilterField();
      }, () => {
        this.loading = this.frontRealFormService.loading = false;
      });
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}) {
    const params = { ...this.targetNetSaleParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.frontRealFormService.loading = true;
      this.subscribeAll$['queryFrontACT$'] = this.frontRealReportService.queryFrontACT(params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.frontRealFormService.loading = false;
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
    this.targetNetSaleParams = Object.assign({}, this.filterData);
    const deptId = ['dept0', 'dept', 'legion', 'group', 'userId'];
    this.targetNetSaleParams['range'] = data['level'] + 2;
    this.targetNetSaleParams[deptId[data['level']]] = [data[`deptId${data['level']}`]];
    if (this.sortParams['key'] && this.sortParams['value']) {
      this.targetNetSaleParams['orderByCode'] = this.sortParams['key'] + ' ' + this.sortParams['value'].replace(/end/, '');
    }
    this.getTableTreeData(data);
    this.tableTreeService.collapse(array, data, $event);
  }


  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.frontRealReportService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.frontRealFormService.loading = false;
  }
}
