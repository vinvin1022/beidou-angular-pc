import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy, DoCheck } from '@angular/core';
import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { ElectricControlService } from '../../../service/electriccontrol.service';
import { LessformService } from '../../../service/lessform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ExDetailListComponent } from '../detailList/exdetailList.component';

import { TableTreeService } from 'src/app/service/table-tree.service';
import { electricControlDayFieldData } from '../../../service/electric-controlDayFieldData';
import { electricControlWmeekFieldData } from '../../../service/electric-controlWmeekFieldData';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { FrontendService } from '../../../service/frontend.service';
import { NzMessageService } from 'ng-zorro-antd';



@Component({
  selector: 'app-subelectric-table',
  templateUrl: './subelectric-table.component.html',
  styleUrls: ['./subelectric-table.component.scss']
})
export class SubelectricTableComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input() filterData = { periodType: 'period_wid' };
  @ViewChild('customColumnDialog', { static: false }) customColumnDialog: CustomColumnDialogComponent;
  @ViewChild('exdetailList', { static: false }) exdetailList: ExDetailListComponent;
  public customColumnData;
  public filterFieldData = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public dataTable = [];
  public loading = false;
  public periodType = this.lessformService.defalutData.periodType;
  public dateType = '1';
  public electricityParams: object = {};
  public subscribeAll$: object = {};
  public widthConfig: Array<string> = [];
  public scrollConfig: object = {};
  public tableTreeData = [];
  public expandDataCache = {};
  public listDimension = [];
  public listValue = [];
  public getMenuMsgParams: object = {};
  public customMenu: object = {};



  constructor(private electricControlService: ElectricControlService, private lessformService: LessformService,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService, private frontendService: FrontendService,
    private customColumnDialogService: CustomColumnDialogService, private activatedRoute: ActivatedRoute,
    private message: NzMessageService) { }


  ngOnChanges() {
    if (this.filterData) {
      this.filterData['dateType'] = this.filterData['periodType'] === 'period_wid' ? '1' : '2';
      this.getDayGroupDivision();
    }
  }
  ngDoCheck() {
    if (this.periodType !== this.electricControlService['periodType']) {
      this.periodType = this.electricControlService['periodType'];
      // this.customColumnData = this.customColumnDialogService.resetColumnData({ ...this._setColumn() });
      this.getMenu();
    }
  }


  ngOnInit() {
    // tslint:disable-next-line:max-line-length   过滤掉电销或者网销字段
    // this.customColumnData = this.customColumnDialogService.resetColumnData({ ...this._setColumn() });
    // this.getMenu();
    this.setWidthScrollConfig();
  }

  setDateType(periodType) {
    this.dateType = periodType === 'period_wid' ? '1' : '2';
  }

  getMenuParams() {
    this.getMenuMsgParams['menuId'] = this.dateType === '1' ? 'electricControlday' : 'electricControlmonth';
  }

  getMenu(fn?: () => void) {
    this.setDateType(this.periodType);
    this.getMenuParams();
    this.customColumnDialogService.getMenu(this.getMenuMsgParams).subscribe(res => {
      if (res.code === 200) {
        const customMenu = JSON.parse(res.result && res.result.customMenu);
        this.customMenu = customMenu || {};
        if (this.customMenu) {
          this.customColumnDialogService.columnData =
            this.customColumnData = this.customColumnDialogService.deleteProto(this.customMenu[this.dateType]);
          // tslint:disable-next-line:no-unused-expression
          fn && fn();
        } else {
          this.customColumnDialogService.columnData = this.customColumnData = {};
        }
      }
    });
  }





  serachData(data) {
    const filterData = this.filterData || { dateType: '1' };
    if (this.dateType !== filterData['dateType']) {
      return;
    }
    this.getFilterField(data);
  }

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
    this.electricityParams = Object.assign({}, this.filterData);
  }


  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const params = this.frontendService.setExportsParams(this.electricityParams, this.customColumnDialogService.columnData);
    return params;
  }


  showCustomColumnDialog() {
    this.getMenu(() => {
      this.customColumnDialog.showDialog(this.customMenu, this.dateType);
    });
  }

  showDetail(rowData: object) {
    this.exdetailList.showModal(rowData, this.filterFieldData, this.allChildren);
  }



  /**
   * 获取表格合计数据
   */
  getDayGroupDivision() {
    this.getMenu(() => {
      this.loading = this.lessformService.loading = true;
      this.setElectricityParams();
      this.subscribeAll$['getDayGroupDivision$'] =
        this.electricControlService.getDayGroupDivision(this.electricityParams).subscribe(res => {
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
  getTableTreeData(data: object = {}, methodName: string = 'getDayGroupLegion') {
    const params = { queryValue: data['userId'], ...this.electricityParams, ...this.tableTreeService._getdlist(data) };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.lessformService.loading = true;
      this.subscribeAll$[`${methodName}$`] = this.electricControlService[methodName](params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.lessformService.loading = false;
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
    let methodName = 'getDayGroupLegion';
    switch (data['level']) {
      case 0:
        methodName = 'getDayGroupLegion';
        break;
      case 1:
        methodName = 'getDayGroupForm';
        break;
      case 2:
        methodName = 'getDayGroupUser';
        break;
      default:
        methodName = 'getDayGroupDivision';
        break;
    }
    this.getTableTreeData(data, methodName);
    this.tableTreeService.collapse(array, data, $event);
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentageday, plusPercentagemonth, formatTime } = this.electricControlService;
    const plusPercentage = this.electricityParams['periodType'] === 'period_wid' ? plusPercentageday : plusPercentagemonth;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage, formatTime);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }


  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.lessformService.loading = false;
  }
}



