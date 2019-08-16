import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { ArmyDataAnalysisService } from '../../../service/armyDataAnalysis.service';
import { setFinalFilterData } from 'src/app/tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { armyDataAnalysisCustomFieldData } from '../../../service/army-data-analysisCustomFieldData';
import { MiddleEndSearchFormService } from '../../../service/middleEndSearchForm.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { FrontendService } from '../../../service/frontend.service';

@Component({
  selector: 'app-subarmydata-table',
  templateUrl: './subarmydata-table.component.html',
  styleUrls: ['./subarmydata-table.component.scss']
})
export class SubarmydataTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  @ViewChild('nzTable', { static: false }) overviewTableData: ElementRef;
  @ViewChild('customColumnDialog', { static: false }) customColumnDialog: CustomColumnDialogComponent;
  public customColumnData: object = {};
  public filterFieldData = {};
  public dataTable: Array<any> = [];
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public midLegionDataParams: object = {};
  public midLegionDataSubscribe$;
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  public dataType = '1';
  public widthConfig: Array<string> = [];
  public scrollConfig: object = {};

  constructor(private middleEndSearchFormService: MiddleEndSearchFormService, private armyDataAnalysisService: ArmyDataAnalysisService,
    private commonCustomService: CommonCustomService, private customColumnDialogService: CustomColumnDialogService,
    private activatedRoute: ActivatedRoute, private message: NzMessageService, private frontendService: FrontendService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.pageIndex = 1;
      this.getMidLegionData();
    }
  }
  ngOnInit() {
    // tslint:disable-next-line:max-line-length   过滤掉电销或者网销字段
    // this.customColumnData = this.customColumnDialogService.resetColumnData({ ...armyDataAnalysisCustomFieldData });
    // this.getMenu();
    this.setWidthScrollConfig();
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
        if (this.customMenu) {
          this.customColumnDialogService.columnData =
            // this.customColumnData = this.customColumnDialogService.shaiXuanSelected(this.customColumnData, customMenu[this.dataType]);
            this.customColumnData = this.customColumnDialogService.deleteProto(this.customMenu[this.dataType]);
          // tslint:disable-next-line:no-unused-expression
          fn && fn();
        } else {
          this.customColumnDialogService.columnData =
            this.customColumnData = this.customColumnDialogService.deleteProto(armyDataAnalysisCustomFieldData);
        }
      }
    });
  }


  pageIndexChange(pageIndex) {
    this.getMidLegionData();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getMidLegionData();
  }


  /**
   * 获取表格数据
   */
  getMidLegionData() {
    this.getMenu(() => {
      const { plusPercentage, formatTime } = this.armyDataAnalysisService;
      this.loading = this.middleEndSearchFormService.loading = true;
      this.setFlowViewReportParams();
      this.midLegionDataSubscribe$ = this.armyDataAnalysisService.getMidLegionData(this.midLegionDataParams).subscribe(res => {
        // this.getMenu(() => { this.getFilterField(this.customColumnData); });
        this.loading = this.middleEndSearchFormService.loading = false;
        this.dataTable = this.commonCustomService.plusPercentageColomn(res.result && res.result.list || [],
          plusPercentage, formatTime);
        this.total = res.result.total;
        this.getFilterField(this.customColumnDialogService.columnData);
      }, error => {
        this.loading = this.middleEndSearchFormService.loading = false;
      });
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
    if (this.dataTable.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['100px', '100px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  /**
   * 军团数据分析导出
   */
  exportMidLegionData() {
    this.armyDataAnalysisService.exportMidLegionData({ ...this.midLegionDataParams });
  }


  /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const exportViewParams = {};
    const costomMenu = [];
    const keys = ['pageNo', 'pageSize'];
    for (const key in this.midLegionDataParams) {
      if (this.midLegionDataParams.hasOwnProperty(key)) {
        if (!keys.includes(key)) {
          exportViewParams[key] = this.midLegionDataParams[key];
        }
      }
    }
    const middleFileds = this.frontendService.middleFileds;
    costomMenu.push(...middleFileds);
    const allChildren = this.customColumnDialogService.filterSelectColoumn(this.customColumnDialogService.columnData).allChildren;
    allChildren.forEach((item, index) => {
      costomMenu.push({
        name: item.label, exName: item.value, sort: index + middleFileds.length
      });
    });

    const params = Object.assign({}, exportViewParams, { costomMenu });
    return params;
  }

  /**
   * 设置查询参数
   */
  setFlowViewReportParams() {
    this.midLegionDataParams = setFinalFilterData(this.filterData);
    this.midLegionDataParams['pageNo'] = this.pageIndex;
    this.midLegionDataParams['pageSize'] = this.pageSize;
  }

  ngOnDestroy() {
    if (this.midLegionDataSubscribe$) {
      this.midLegionDataSubscribe$.unsubscribe();
    }
    this.middleEndSearchFormService.loading = false;
  }

  showCustomColumnDialog() {
    this.getMenu(() => {
      this.customColumnDialog.showDialog(this.customMenu, this.dataType);
    });
  }
}
