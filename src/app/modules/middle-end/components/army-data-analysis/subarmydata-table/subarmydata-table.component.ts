import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CustomColumnDialogComponent } from 'src/app/modules/common-custom/components/custom-column-dialog/custom-column-dialog.component';
import { MiddleEndSearchFormService } from '../../../service/middleEndSearchForm.service';
import { ArmyDataAnalysisService } from '../../../service/armyDataAnalysis.service';
import { setFinalFilterData } from 'src/app/tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { armyDataAnalysisCustomFieldData } from '../../../service/army-data-analysisCustomFieldData';

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
  public filterFieldData;
  public dataTable: Array<any> = [];
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public midLegionDataParams: object = {};
  public midLegionDataSubscribe$;
  public nzWidthConfig: Array<string> = [
    '50px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'];
  public nzScroll: object = { x: '5350px', y: '500px' };

  constructor(private middleEndSearchFormService: MiddleEndSearchFormService, private armyDataAnalysisService: ArmyDataAnalysisService,
    private commonCustomService: CommonCustomService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getMidLegionData();
    }
  }
  ngOnInit() {
    this.customColumnData = armyDataAnalysisCustomFieldData;
  }


  pageIndexChange(pageIndex) {
    this.getMidLegionData();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getMidLegionData();
  }



  /**
   * 获取自定义列过滤数据
   * @param data 參數
   */
  getFilterField(data) {
    const releasemonitoring = data.armyDataAnalysis;
    this.filterFieldData = releasemonitoring.children.filter((item) => (item['checked']));
    this.nzWidthConfig = this.setTdWith(this.filterFieldData);
    this.nzScroll = { x: `${(this.nzWidthConfig.length * 100)}px`, y: '500px' };
  }

  setTdWith(pageInfoTitle) {
    const nzWidthConfig = ['100px', '100px'];
    pageInfoTitle.forEach(() => {
      nzWidthConfig.push('100px');
    });
    return nzWidthConfig;
  }

  /**
   * 获取表格数据
   */
  getMidLegionData() {
    const { plusPercentage, formatTime } = this.armyDataAnalysisService;
    this.loading = this.middleEndSearchFormService.loading = true;
    this.setFlowViewReportParams();
    this.midLegionDataSubscribe$ = this.armyDataAnalysisService.getMidLegionData(this.midLegionDataParams).subscribe(res => {
      this.customColumnDialog.handleOk(this.customColumnData);
      this.loading = this.middleEndSearchFormService.loading = false;
      this.dataTable = this.commonCustomService.plusPercentageColomn(res.result && res.result.list || [],
        plusPercentage, formatTime);
      this.total = res.result.total;
    }, error => {
      this.loading = this.middleEndSearchFormService.loading = false;
    });
  }

  /**
   * 军团数据分析导出
   */
  exportMidLegionData() {
    this.armyDataAnalysisService.exportMidLegionData({ ...this.midLegionDataParams });
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
  }

  showCustomColumnDialog() {
    this.customColumnDialog.showDialog(this.customColumnData);
  }




}
