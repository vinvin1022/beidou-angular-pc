import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { SituationBusinessFormService } from '../../../service/situation-business-form.service';
import { SituationOfBusinessService } from '../../../service/situation-of-business.service';
import { situationOfBusinessCustomFieldData } from '../../../service/situation-of-businessCustomFieldData';


@Component({
  selector: 'app-situation-business-table',
  templateUrl: './situation-business-table.component.html',
  styleUrls: ['./situation-business-table.component.scss']
})
export class SituationBusinessTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public customColumnData: object = {};
  public filterFieldData;
  public loading = false;
  public subscribeAll$: object = {};
  public targetNetSaleParams: object = {};
  public exportsParams: object = {};

  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: object = {};
  public sortParams = {};
  public showChart = false;

  tableTreeData = [];
  expandDataCache = {};
  constructor(private situationOfBusinessService: SituationOfBusinessService, private situationBusinessFormService: SituationBusinessFormService,
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


  initchart() {
    this.showChart = true;
  }
  pageIndexChange(pageIndex) {
    this.getDivisonNetSaleData();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getDivisonNetSaleData();
  }

  /**
   * 获取自定义列过滤数据
   */
  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(situationOfBusinessCustomFieldData);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }


  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length,
        ['230px', '100px', '100px', '100px', '100px'], '108px');
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  sort(sort: { key: string; value: string }): void {
    this.sortParams = sort;
    this.getDivisonNetSaleData();
  }

  /**
   * 设置getTargetNetSale() 参数
   */
  setTargetNetSaleParams() {
    this.targetNetSaleParams = Object.assign({}, this.filterData);
    this.targetNetSaleParams['range'] = 1;
    this.targetNetSaleParams['pageIndex'] = this.pageIndex;
    this.targetNetSaleParams['pageSize'] = this.pageSize;
    if (this.sortParams['key'] && this.sortParams['value']) {
      this.targetNetSaleParams['orderByCode'] = this.sortParams['key'] + ' ' + this.sortParams['value'].replace(/end/, '');
    }
    this.exportsParams = { ...this.targetNetSaleParams };
  }



  // /**
  //  * 实时导出
  //  */
  // exportsFile() {
  //   this.exportsParams['range'] = 5;
  //   this.situationOfBusinessService.savefrontACTQueryVO(this.exportsParams).subscribe(res => {
  //     this.situationOfBusinessService.exportFrontACT({ ridesKey: res.result });
  //   });
  // }





  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.loading = this.situationBusinessFormService.loading = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$['queryCardAbout$'] = this.situationOfBusinessService.queryCardAbout(this.targetNetSaleParams)
      .subscribe(res => {
        this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
        this.initTreeTable();
        this.loading = this.situationBusinessFormService.loading = false;
        this.getFilterField();
      }, () => {
        this.loading = this.situationBusinessFormService.loading = false;
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
      this.loading = this.situationBusinessFormService.loading = true;
      this.subscribeAll$['queryCardAbout$'] = this.situationOfBusinessService.queryCardAbout(params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.situationBusinessFormService.loading = false;
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
    this.targetNetSaleParams = Object.assign({}, this.filterData);
    const deptId = ['dept0', 'dept', 'legion', 'advertisersTypeList'];
    this.targetNetSaleParams['range'] = data['level'] + 2;
    this.targetNetSaleParams[deptId[data['level']]] = [data[`showId`]];
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
    const { plusPercentage } = this.situationOfBusinessService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.situationBusinessFormService.loading = false;
  }
}
