import { Component, OnInit, ElementRef, ViewChild, OnChanges, AfterViewInit, Input, OnDestroy, DoCheck } from '@angular/core';

import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { DetailListAComponent } from '../detailListA/detailListA.component';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { generalIntroductionACustomFieldData } from '../../../service/general-introductionACustomFieldData';
import { GeneralIntroductionAService } from '../../../service/general-introductionA.service';
import { GensearchCriteriaService } from '../../../service/gensearch-criteria.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { setFinalFilterData } from 'src/app/tools';


@Component({
  selector: 'app-subgeneral-tablea',
  templateUrl: './subgeneral-tableA.component.html',
  styleUrls: ['./subgeneral-tableA.component.scss']
})
export class SubgeneralTableAComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input() filterData: Object = { flowDataType: '1' };
  @ViewChild('customColumnDialog', { static: false }) customColumnDialog: CustomColumnDialogComponent;
  @ViewChild('detailList', { static: false }) detailList: DetailListAComponent;
  public title: String = '自定义显示列';
  public customColumnData: Object = {};
  public displayData: Array<any> = [];
  public filterFieldData = {};
  public flowViewReportParams = {};
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public loading: Boolean = false;
  public flowViewReport$;
  public flowDataType = '1';
  public newFlowDataType = '1';
  public subscribeAll$: object = {};
  public rowData: Object = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public getMenuMsgParams: object = {};
  public customMenu: object = {};

  public listDimension: Array<any> = [];
  public listValue: Array<any> = [];
  public selectDimensions: Array<Object> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};

  tableTreeData = [];
  expandDataCache = {};


  constructor(private generalIntroduction: GeneralIntroductionAService, private commonCustomService: CommonCustomService,
    private gensearchCriteriaService: GensearchCriteriaService, private tableTreeService: TableTreeService,
    private customColumnDialogService: CustomColumnDialogService, private activatedRoute: ActivatedRoute,
    private message: NzMessageService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.selectDimensions = this.filterData['selectDimensions'];
      delete this.filterData['selectDimensions'];
      this.submitOrReset();
    }
  }

  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length   过滤掉电销或者网销字段
    // this.customColumnData = this.filterFlowDataType(this.customColumnDialogService.resetColumnData({ ...generalIntroductionACustomFieldData }));
    // tslint:disable-next-line:max-line-length
    // this.gensearchCriteriaService.flowDataType = this.flowDataType = this.gensearchCriteriaService.formateFlowDataType(this.gensearchCriteriaService.defaultFormData.flowDataType)['optionName'];
    this.gensearchCriteriaService.flowDataType = this.flowDataType;
    this.setWidthScrollConfig();
    // this.getMenu();
  }

  ngDoCheck() {
    if (this.flowDataType !== this.gensearchCriteriaService.flowDataType) {
      this.flowDataType = this.gensearchCriteriaService.flowDataType;
      // 过滤掉电销或者网销字段
      // tslint:disable-next-line:max-line-length
      // this.customColumnData = this.filterFlowDataType(this.customColumnDialogService.resetColumnData({ ...generalIntroductionACustomFieldData }));
      this.getMenu();
    }
  }

  getMenuParams() {
    const { path } = this.activatedRoute.routeConfig;
    this.getMenuMsgParams['menuId'] = path;
  }

  getMenu(fn?: Function) {
    this.getMenuParams();
    this.customColumnDialogService.getMenu(this.getMenuMsgParams).subscribe(res => {
      if (res.code === 200) {
        const customMenu = JSON.parse(res.result && res.result.customMenu);
        this.customMenu = customMenu || {};
        if (this.customMenu) {
          this.customColumnDialogService.columnData =
            this.customColumnData = this.customColumnDialogService.deleteProto(this.customMenu[this.flowDataType]);
          // tslint:disable-next-line:no-unused-expression
          fn && fn();
        } else {
          // this.customColumnDialogService.columnData = this.customColumnData;
        }
      }
    });
  }


  showDetailListModal(data) {
    this.rowData = data;
    this.detailList.showModal(this.rowData, this.filterFieldData, this.allChildren);
  }

  /**
   * 设置查询参数
   */
  setFlowViewReportParams() {
    // this.flowViewReportParams = this.gensearchCriteriaService.setFinalFilterData(this.filterData);
    this.flowViewReportParams = setFinalFilterData(this.filterData);
    this.flowViewReportParams['pageNo'] = this.pageIndex;
    this.flowViewReportParams['pageSize'] = this.pageSize;
    if (this.selectDimensions.length) {
      this.flowViewReportParams['queryDimension'] = this.flowViewReportParams['groupDimension'] = this.selectDimensions[0]['value'];
    } else {
      return false;
    }
    this.flowViewReportParams['isClear'] = false;
    this.flowViewReportParams['isflConsultingProject'] = false;

    const clearArrs = ['men_area_name', 'source', 'fl_consulting_project'];

    for (let index = 0; index < this.selectDimensions.length; index++) {
      const item = this.selectDimensions[index];
      if (clearArrs.includes(item['value'])) {
        this.flowViewReportParams['isClear'] = true;
      }
      if (item['value'] === 'men_area_name' || item['value'] === 'source') {
        this.flowViewReportParams['isflConsultingProject'] = true;
      }
    }

    this.flowViewReportParams['leafNode'] = this.selectDimensions.length > 1 ? true : false;

  }


  submitOrReset() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.setTableData();
  }

  pageIndexChange(pageIndex) {
    this.setTableData();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.setTableData();
  }


  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const exportViewParams = {};
    const listValue = [];
    const listDimension = [];
    const costomMenu = [];
    const keys = ['pageNo', 'pageSize', 'dimensionValue', 'queryDimension', 'listValue'];
    for (const key in this.flowViewReportParams) {
      if (this.flowViewReportParams.hasOwnProperty(key)) {
        if (!keys.includes(key)) {
          exportViewParams[key] = this.flowViewReportParams[key];
        }
      }
    }
    this.selectDimensions.forEach((item, index) => {
      listValue.push(item['label']);
      listDimension.push(item['value']);
      costomMenu.push({ name: item['label'], exName: item['value'], sort: index });
    });
    costomMenu.push({ name: '日期', exName: 'periodWid', sort: costomMenu.length });
    exportViewParams['listValue'] = listValue;
    exportViewParams['listDimension'] = listDimension;
    const allChildren = this.customColumnDialogService.filterSelectColoumn(this.customColumnDialogService.columnData).allChildren;
    allChildren.forEach((item, index) => {
      costomMenu.push({
        name: item.label, exName: item.value, sort: index + this.selectDimensions.length + 1
      });
    });

    const params = Object.assign({}, exportViewParams, { costomMenu });
    return params;
  }




  /**
   * 获取表格数据
   */
  setTableData() {
    this.getMenu(() => {
      this.newFlowDataType = this.flowDataType;
      this.loading = this.gensearchCriteriaService.loading = true;
      this.setFlowViewReportParams();

      this.flowViewReport$ = this.generalIntroduction.getGroupPromoteOverview(this.flowViewReportParams).subscribe(res => {
        this.loading = this.gensearchCriteriaService.loading = false;
        res.result = res.result || [];
        this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
        this.initTreeTable();
        this.getFilterField(this.customColumnDialogService.columnData);
      }, error => {
        this.loading = this.gensearchCriteriaService.loading = false;
      });
    });

  }


  /**
   * 打开自定义列弹窗
   */
  showCustomColumnDialog() {

    this.getMenu(() => {
      this.customColumnDialog.showDialog(this.customMenu, this.flowDataType);
    });
  }

  serachData(data) {
    const filterData = this.filterData || { 'flowDataType': '1' };
    if (this.flowDataType !== filterData['flowDataType']) {
      return;
    }
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
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['300px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  /**
  * 过滤电销或者网销字段
  * @param customColumnData object
  */
  filterFlowDataType(customColumnData: object) {
    const tmpObj = {};
    for (const pkey in customColumnData) {
      if (customColumnData.hasOwnProperty(pkey)) {
        const pelement = customColumnData[pkey];
        tmpObj[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              tmpObj[pkey][mkey] = melement;
            } else {
              const newChildren = melement.filter(item => (!item.type || (item.type === this.flowDataType)));
              tmpObj[pkey][mkey] = newChildren;
            }
          }
        }
      }
    }
    return tmpObj;
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}, methodName: string = 'getDayGroupLegion') {
    const params = { dimensionValue: data['dimensionKey'], ...this.flowViewReportParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.gensearchCriteriaService.loading = true;
      this.subscribeAll$[`${methodName}$`] = this.generalIntroduction[methodName](params).subscribe(res => {
        res.result = res.result || [];
        // const newRes = res.result.map(item => {
        //   item['key'] = item['dimensionKey'];
        //   return item;
        // });
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.gensearchCriteriaService.loading = false;
      }, err => {
        this.loading = this.gensearchCriteriaService.loading = false;
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
    this.listDimension = [];
    this.listValue = [];
    const methodName = 'getGroupPromoteOverview';
    this._collapseParams(data);
    this.getTableTreeData(data, methodName);
    this.tableTreeService.collapse(array, data, $event);
  }

  private _collapseParams(data: object): void {
    this.flowViewReportParams['queryDimension'] = this.selectDimensions[data['level']]['value'];
    if (this.selectDimensions[data['level'] + 1]) {
      this.flowViewReportParams['groupDimension'] = this.selectDimensions[data['level'] + 1]['value'];
    }
    this.flowViewReportParams['leafNode'] = (this.selectDimensions.length - 1) === (data['level'] + 1) ? false : true;
    this._getdlist(this.selectDimensions, data);
    this.flowViewReportParams['listDimension'] = this.listDimension;
    this.flowViewReportParams['listValue'] = this.listValue;
  }

  private _getdlist(selectDimensions: Array<any>, data: object): void {
    this.listDimension.push(selectDimensions[data['level']]['value']);
    this.listValue.push(data['dimensionKey']);
    if (data['parent']) {
      this._getdlist(selectDimensions, data['parent']);
    }
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data?: object): void {
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, this.generalIntroduction.plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    if (this.flowViewReport$) {
      this.flowViewReport$.unsubscribe();
    }
  }
}
