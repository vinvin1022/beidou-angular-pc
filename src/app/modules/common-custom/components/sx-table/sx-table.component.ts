import {
  Component, OnInit, OnChanges, Input, OnDestroy, SimpleChanges, TemplateRef,
  Renderer2, ElementRef, ViewChild, ViewContainerRef, AfterViewInit, AfterViewChecked, ContentChild
} from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';


@Component({
  selector: 'app-sx-table',
  templateUrl: './sx-table.component.html',
  styleUrls: ['./sx-table.component.scss']
})
export class SxTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData: object = {};   // 请求参数
  @Input() serviceNameClass: object;   // 请求表格数据服务类  必传
  @Input() methodName: string;    // 请求表格方法名   必传
  @Input() tableFields: object = {};   // 表格展示的字段 必传
  @Input() treeFields: Array<string>;  // 表格树形结构层级字段  如果是树形表格 必须传该字段
  @Input() cardTitle: TemplateRef<any>;
  @Input() exportMethod: string;
  @Input() showPagination = false;
  @Input() showFirstColumn = true;
  @Input() customColumnWidth = ['230px'];
  @Input() saveBackQueryExport;

  @ContentChild('exportsbtn', { static: false }) exportsbtntpl: TemplateRef<any>;


  private requestTableParams: object = {};  // 请求table数据参数
  public total = 0;
  public pageIndex = 1;
  public pageSize = 10;
  public firstColumn = { label: '部门', value: 'showName' };


  public loading = false;
  public subscribeAll$: object = {};
  public exportsParams: object = {};

  public filterFieldData;
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: object = {};


  tableTreeData = [];
  expandDataCache = {};
  constructor(private customColumnDialogService: CustomColumnDialogService, private commonCustomService: CommonCustomService,
    private tableTreeService: TableTreeService) { }




  ngOnChanges(changes: SimpleChanges) {
    if (changes.filterData.currentValue) {
      this.getTableData();
    }
  }
  ngOnInit() {
    this.setWidthScrollConfig();
  }



  pageIndexChange(pageIndex) {
    this.getTableData();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getTableData();
  }

  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(this.tableFields);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }


  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length,
        this.customColumnWidth, '108px');
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
    this.requestTableParams = Object.assign({}, this.filterData);
    if (this.showPagination) {
      this.requestTableParams['pageNo'] = this.pageIndex;
      this.requestTableParams['pageSize'] = this.pageSize;
    }
    if (this.treeFields) {
      this.requestTableParams['range'] = 1;
    }

    this.exportsParams = { ...this.requestTableParams };
  }


  /**
   * 实时导出
   */
  exportsFile() {
    if (this.treeFields && this.treeFields.length) {
      this.exportsParams['range'] = this.treeFields.length + 1;
    }
    delete this.exportsParams['pageNo'];
    delete this.exportsParams['pageSize'];

    if (this.saveBackQueryExport) {
      this.serviceNameClass[this.saveBackQueryExport](this.exportsParams).subscribe(res => {
        this.serviceNameClass[this.exportMethod]({ ridesKey: res.result });
      });
    } else {
      this.serviceNameClass[this.exportMethod](this.exportsParams);
    }

  }





  /**
   * 获取表格合计数据
   */
  getTableData() {
    this.loading = this.serviceNameClass['loading'] = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$[`${this.methodName}$`] = this.serviceNameClass[this.methodName](this.requestTableParams)
      .subscribe(res => {
        if (this.showPagination) {
          this.tableTreeData = this.tableTreeService.createTableTreeChildren((res.result && res.result.list) || []);
          this.total = (res.result && res.result.total) || 0;
        } else {
          this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result || []);
        }

        this.initTreeTable();
        this.loading = this.serviceNameClass['loading'] = false;
        this.getFilterField();
      }, () => {
        this.loading = this.serviceNameClass['loading'] = false;
      });
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}) {
    const params = { ...this.requestTableParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.serviceNameClass['loading'] = true;
      this.subscribeAll$[`${this.methodName}$`] = this.serviceNameClass[this.methodName](params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.serviceNameClass['loading'] = false;
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
    this.requestTableParams = Object.assign({}, this.filterData);
    const deptId = this.treeFields;
    this.requestTableParams['range'] = data['level'] + 2;
    this.requestTableParams[deptId[data['level']]] = data['showId'];
    this.getTableTreeData(data);
    this.tableTreeService.collapse(array, data, $event);
  }


  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const plusPercentage = this.serviceNameClass['plusPercentage'];
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.serviceNameClass['loading'] = false;
  }
}
