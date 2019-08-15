import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MiddleEndSearchFormService } from '../../../service/middleEndSearchForm.service';
import { setFinalFilterData } from 'src/app/tools';
import { ArmyFlowAnalysisService } from '../../../service/armyFlowAnalysis.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ActivatedRoute } from '@angular/router';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { armyFlowAnalysisCustomFieldData } from '../../../service/army-flow-analysisCustomFieldData';
import { FrontendService } from '../../../service/frontend.service';

@Component({
  selector: 'app-subarmyflow-table',
  templateUrl: './subarmy-flow-table.component.html',
  styleUrls: ['./subarmy-flow-table.component.scss']
})
export class SubarmyflowTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public dataTable = [];
  public loading: Boolean = false;
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public midLegionFlowParams: Object = {};
  public midLegionFlowSubscribe$;

  public customColumnData: object = {};
  public filterFieldData: object = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public getMenuMsgParams: object = {};
  public customMenu: object = {};
  public flowDataType = '1';
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};
  constructor(private armyFlowAnalysisService: ArmyFlowAnalysisService, private middleEndSearchFormService: MiddleEndSearchFormService,
    private commonCustomService: CommonCustomService, private frontendService: FrontendService,
    private customColumnDialogService: CustomColumnDialogService,
     private activatedRoute: ActivatedRoute) { }

  ngOnChanges() {
    if (this.filterData) {
      this.pageIndex = 1;
      this.getMidLegionFlow();
    }
  }
  ngOnInit() {
    // this.getMidLegionFlow();
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
        if (customMenu && customMenu[this.flowDataType]) {
          this.customColumnData = this.customColumnDialogService.deleteProto(customMenu[this.flowDataType]);
          // tslint:disable-next-line:no-unused-expression
          fn && fn();
        } else {
          this.customColumnData = this.customColumnDialogService.deleteProto(armyFlowAnalysisCustomFieldData);
        }
        // this.getFilterField(this.customColumnData);
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
    if (this.dataTable.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['100px', '100px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  pageIndexChange(pageIndex) {
    this.getMidLegionFlow();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getMidLegionFlow();
  }


  /**
   * 获取表格数据
   */
  getMidLegionFlow() {
    this.getMenu(() => {
      this.loading = this.middleEndSearchFormService.loading = true;
      this.setFlowViewReportParams();
      this.midLegionFlowSubscribe$ = this.armyFlowAnalysisService.getMidLegionFlow(this.midLegionFlowParams).subscribe(res => {
        this.loading = this.middleEndSearchFormService.loading = false;
        this.dataTable = this.commonCustomService.plusPercentageColomn(res.result && res.result.list || [],
          this.armyFlowAnalysisService.plusPercentage);
        this.total = res.result.total;
        this.getFilterField(this.customColumnData);
      }, error => {
        this.loading = this.middleEndSearchFormService.loading = false;
      });
    });
  }


  /**
 * 军团数据分析导出
 */
  exportMidLegionFlow() {
    this.armyFlowAnalysisService.exportMidLegionFlow({ ...this.midLegionFlowParams });
  }

   /**
   * 设置导出参数
   */
  getExportsParams = () => {
    const exportViewParams = {};
    const costomMenu = [];
    const keys = ['pageNo', 'pageSize'];
    for (const key in this.midLegionFlowParams) {
      if (this.midLegionFlowParams.hasOwnProperty(key)) {
        if (!keys.includes(key)) {
          exportViewParams[key] = this.midLegionFlowParams[key];
        }
      }
    }
    const middleFileds = this.frontendService.middleFileds;
    costomMenu.push(...middleFileds);
    const allChildren = this.allChildren;
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
    this.midLegionFlowParams = setFinalFilterData(this.filterData);
    this.midLegionFlowParams['pageNo'] = this.pageIndex;
    this.midLegionFlowParams['pageSize'] = this.pageSize;
  }

  ngOnDestroy() {
    if (this.midLegionFlowSubscribe$) {
      this.midLegionFlowSubscribe$.unsubscribe();
    }
    this.middleEndSearchFormService.loading = false;
  }
}
