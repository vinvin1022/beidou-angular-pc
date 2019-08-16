import {
  Component, OnInit, OnChanges, Input, OnDestroy, SimpleChanges, TemplateRef,
  Renderer2, ElementRef
} from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';


@Component({
  selector: 'app-reach-rate-table',
  templateUrl: './reach-rate-table.component.html',
  styleUrls: ['./reach-rate-table.component.scss']
})
export class ReachRateTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData: object = {};   // 请求参数
  @Input() serviceNameClass: object;   // 请求表格数据服务类  必传
  @Input() methodName: string;    // 请求表格方法名   必传
  @Input() tableFields: object = {};   // 表格展示的字段 必传
  @Input() treeFields: Array<string>;  // 表格树形结构层级字段  如果是树形表格 必须传该字段
  @Input() cardTitle: TemplateRef<any>;
  @Input() exportMethod: string;
  private requestTableParams: object = {};  // 请求table数据参数


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
    private tableTreeService: TableTreeService, private renderer2: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filterData.currentValue) {
      this.getDivisonNetSaleData();
    }
  }
  ngOnInit() {
    this.setWidthScrollConfig();
  }






  /**
   * 获取自定义列过滤数据
   */
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
    this.requestTableParams = Object.assign({}, this.filterData);
    this.requestTableParams['range'] = 1;
    this.exportsParams = { ...this.requestTableParams };
  }


  /**
   * 实时导出
   */
  exportsFile() {
    if (this.treeFields.length) {
      this.exportsParams['range'] = this.treeFields.length + 1;
    }
    this.serviceNameClass[this.exportMethod](this.exportsParams);
  }





  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.loading = this.serviceNameClass['loading'] = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$[`${this.methodName}$`] = this.serviceNameClass[this.methodName](this.requestTableParams)
      .subscribe(res => {
        this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result || []);
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
   * @param array Array
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
