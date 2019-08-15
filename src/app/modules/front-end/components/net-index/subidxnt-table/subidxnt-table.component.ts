import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { NetindexService } from '../../../service/netindex.service';
import { LessformService } from '../../../service/lessform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { IndexDetailListComponent } from '../indexDetailList/indexDetailList.component';
import { netIndexDayFieldData } from '../../../service/net-indexDayFieldData';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { FrontendService } from '../../../service/frontend.service';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-subidxnt-table',
  templateUrl: './subidxnt-table.component.html',
  styleUrls: ['./subidxnt-table.component.scss']
})
export class SubidxntTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  @ViewChild('indexDetailList', {static: false}) indexDetailList: IndexDetailListComponent;
  @ViewChild('customColumnDialog', {static: false}) customColumnDialog: CustomColumnDialogComponent;
  public customColumnData: Object = {};
  public filterFieldData;
  public dataTable = [];
  public loading: Boolean = false;
  public subscribeAll$: Object = {};
  public targetNetSaleParams: Object = {};
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  public flowDataType = '1';
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};

  tableTreeData = [];
  expandDataCache = {};
  constructor(private netindexService: NetindexService, private lessformService: LessformService, private frontendService: FrontendService,
    private customColumnDialogService: CustomColumnDialogService, private activatedRoute: ActivatedRoute,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService, private message: NzMessageService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getDivisonNetSaleData();
    }
  }
  ngOnInit() {
    // this.customColumnData = this.customColumnDialogService.resetColumnData({ ...netIndexDayFieldData });
    // this.getMenu();
    this.setWidthScrollConfig();
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
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['230px']);
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
  }

  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    return this.frontendService.setExportsParams(this.targetNetSaleParams, this.customColumnDialogService.columnData);
  }

  showCustomColumnDialog() {
    this.getMenu(() => {
      this.customColumnDialog.showDialog(this.customMenu, this.flowDataType);
    });
  }


  showDetail(rowData: object) {
    this.indexDetailList.showModal(rowData, this.filterFieldData, this.allChildren);
  }



  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.getMenu(() => {
      this.loading = this.lessformService.loading = true;
      this.setTargetNetSaleParams();
      const url = 'dms/frond/divisonNetSale';
      this.subscribeAll$['getDivisonNetSaleData$'] = this.netindexService.getDivisonNetSaleData(url, this.targetNetSaleParams)
        .subscribe(res => {
          // this.customColumnDialog.handleOk(this._setColumn());
          // this.getMenu(() => { this.getFilterField(this.customColumnData); });
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
  getTableTreeData(data: object = {}, url: string = 'dms/frond/legionNetSale') {
    const params = { queryValue: data['userId'], ...this.targetNetSaleParams, ...this.tableTreeService._getdlist(data) };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.lessformService.loading = true;
      this.subscribeAll$['getDivisonNetSaleData$'] = this.netindexService.getDivisonNetSaleData(url, params).subscribe(res => {
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
    let url = 'dms/frond/legionNetSale';
    switch (data['level']) {
      case 0:
        url = 'dms/frond/legionNetSale';
        break;
      case 1:
        url = 'dms/frond/formNetSale';
        break;
      case 2:
        url = 'dms/frond/userNetSale';
        break;
      default:
        url = 'dms/frond/divisonNetSale';
        break;
    }
    this.getTableTreeData(data, url);
    this.tableTreeService.collapse(array, data, $event);



  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage, formatTime } = this.netindexService;
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
