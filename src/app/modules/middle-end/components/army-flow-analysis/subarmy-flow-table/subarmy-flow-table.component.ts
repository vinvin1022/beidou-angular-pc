import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MiddleEndSearchFormService } from '../../../service/middleEndSearchForm.service';
import { setFinalFilterData } from 'src/app/tools';
import { ArmyFlowAnalysisService } from '../../../service/armyFlowAnalysis.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

@Component({
  selector: 'app-subarmyflow-table',
  templateUrl: './subarmy-flow-table.component.html',
  styleUrls: ['./subarmy-flow-table.component.scss']
})
export class SubarmyflowTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public dataTable = [];
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public midLegionFlowParams: object = {};
  public midLegionFlowSubscribe$;
  constructor(private armyFlowAnalysisService: ArmyFlowAnalysisService, private middleEndSearchFormService: MiddleEndSearchFormService,
    private commonCustomService: CommonCustomService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getMidLegionFlow();
    }
  }
  ngOnInit() {
    // this.getMidLegionFlow();
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
    this.loading = this.middleEndSearchFormService.loading = true;

    this.setFlowViewReportParams();
    this.midLegionFlowSubscribe$ = this.armyFlowAnalysisService.getMidLegionFlow(this.midLegionFlowParams).subscribe(res => {
      this.loading = this.middleEndSearchFormService.loading = false;
      this.dataTable = this.commonCustomService.plusPercentageColomn(res.result && res.result.list || [],
        this.armyFlowAnalysisService.plusPercentage);
      this.total = res.result.total;
    }, error => {
      this.loading = this.middleEndSearchFormService.loading = false;
    });
  }


  /**
   * 军团数据分析导出
   */
  exportMidLegionFlow() {
    this.armyFlowAnalysisService.exportMidLegionFlow({ ...this.midLegionFlowParams });
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
  }
}
