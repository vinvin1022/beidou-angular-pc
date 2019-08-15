import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy, DoCheck } from '@angular/core';
import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { LessformService } from '../../../service/lessform.service';


import { TableTreeService } from 'src/app/service/table-tree.service';
import { FrontendService } from '../../../service/frontend.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { IncubationProjectService } from '../../../service/incubation-project.service';
import { incubationProjectFieldData } from '../../../service/incubation-projectFieldData';



@Component({
  selector: 'app-subproject-table',
  templateUrl: './subproject-table.component.html',
  styleUrls: ['./subproject-table.component.scss']
})
export class SubprojectableComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input() filterData = {};
  @ViewChild('customColumnDialog', {static: false}) customColumnDialog: CustomColumnDialogComponent;
  public customColumnData;
  public filterFieldData = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public dataTable = [];
  public loading: Boolean = false;
  public periodType: String = this.lessformService.defalutData.periodType;
  public dateType = '1';
  public MDCParams = {};
  public subscribeAll$: Object = {};
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};
  public tableTreeData = [];
  public expandDataCache = {};
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  public expoetMDCParams = {};



  constructor(private incubationProjectService: IncubationProjectService, private lessformService: LessformService,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService, private frontendService: FrontendService,
    private customColumnDialogService: CustomColumnDialogService) { }


  ngOnChanges() {
    if (this.filterData) {
      this.getQueryMDCView();
    }
  }
  ngDoCheck() {
    if (this.periodType !== this.incubationProjectService['periodType']) {
      this.periodType = this.incubationProjectService['periodType'];
      this.getMenu();
    }
  }


  ngOnInit() {
    this.setWidthScrollConfig();
  }


  getMenuParams() {
    this.getMenuMsgParams['menuId'] = this.dateType === '1' ? 'electricControlday' : 'electricControlmonth';
  }

  getMenu(fn?: Function) {
    this.customColumnDialogService.columnData = this.customColumnData = incubationProjectFieldData;

    // tslint:disable-next-line:no-unused-expression
    fn && fn();
    // this.setDateType(this.periodType);
    // this.getMenuParams();
    // this.customColumnDialogService.getMenu(this.getMenuMsgParams).subscribe(res => {
    //   if (res.code === 200) {
    //     const customMenu = JSON.parse(res.result && res.result.customMenu);
    //     this.customMenu = customMenu || {};
    //     if (this.customMenu) {
    //       this.customColumnDialogService.columnData =
    //         this.customColumnData = this.customColumnDialogService.deleteProto(this.customMenu[this.dateType]);
    //       // tslint:disable-next-line:no-unused-expression
    //       fn && fn();
    //     } else {
    //       this.customColumnDialogService.columnData = this.customColumnData = {};
    //     }
    //   }
    // });
  }





  serachData(data) {
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
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['230px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }


  /**
   * 设置查询参数
   */
  setElectricityParams() {
    this.MDCParams = {};
    this.expoetMDCParams = {};
    this._formateMDC();
    this.MDCParams['range'] = 1;
    this.expoetMDCParams = { ...this.MDCParams };
  }

  private _formateMDC() {
    for (const key in this.filterData) {
      if (this.filterData.hasOwnProperty(key)) {
        const element = this.filterData[key];
        if (key === 'business') {
          this.MDCParams['deptId1'] = element;
        } else if (key === 'deptId1') {
          this.MDCParams['deptId2'] = element;
        } else if (key === 'deptId2') {
          this.MDCParams['deptId3'] = element;
        } else if (key === 'userId') {
          this.MDCParams['userIds'] = element;
        } else {
          this.MDCParams[key] = element;
        }
      }
    }
  }


  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const params = this.frontendService.setExportsParams(this.expoetMDCParams, this.customColumnDialogService.columnData);
    return params;
  }


  showCustomColumnDialog() {
    this.getMenu(() => {
      this.customColumnDialog.showDialog(this.customMenu, this.dateType);
    });
  }

  /**
   * 获取表格合计数据
   */
  getQueryMDCView() {
    this.getMenu(() => {
      this.loading = this.lessformService.loading = true;
      this.setElectricityParams();
      this.subscribeAll$['queryMDCView$'] =
        this.incubationProjectService.queryMDCView(this.MDCParams).subscribe(res => {
          this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
          this.initTreeTable();
          this.loading = this.lessformService.loading = false;
          this.getFilterField(this.customColumnDialogService.columnData);
        }, () => {
          this.loading = this.lessformService.loading = false;
        });
    });
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}, methodName: string = 'queryMDCView') {
    const params = { ...this.MDCParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.lessformService.loading = true;
      this.subscribeAll$[`${methodName}$`] = this.incubationProjectService[methodName](params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.lessformService.loading = false;
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
    const levels = { 1: 'deptId1', 2: 'deptId2', 3: 'deptId3' };
    this.MDCParams = Object.assign({}, this.expoetMDCParams);
    this.MDCParams['range'] = data['level'] + 2;
    this.MDCParams[levels[data['level'] + 1]] = [data[levels[data['level'] + 1]]];
    this.getTableTreeData(data);
    this.tableTreeService.collapse(array, data, $event);
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.incubationProjectService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }


  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.lessformService.loading = false;
  }
}



