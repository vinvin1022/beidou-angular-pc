import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommonrearformService } from '../../../service/commonrearform.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { RearendRealTimeReportService } from '../../../service/rearend-real-time-report.service';
import { setFinalFilterData } from 'src/app/tools';

@Component({
  selector: 'app-subrearend-real-table',
  templateUrl: './subrearend-real-table.component.html',
  styleUrls: ['./subrearend-real-table.component.scss']
})
export class SubrearendRealTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public performanceParams: object = {};
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public subscribeAll$: object = {};

  public displayData = [];
  constructor(private rearendRealTimeReportService: RearendRealTimeReportService,
    private commonrearform: CommonrearformService, private commonCustomService: CommonCustomService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.pageIndex = 1;
      this.getQueryDaliyTimeACTVOs();
    }
  }
  ngOnInit() { }

  pageIndexChange(pageIndex) {
    this.getQueryDaliyTimeACTVOs();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getQueryDaliyTimeACTVOs();
  }

  /**
   * 设置查询参数
   */
  setPerformanceParams() {
    const performanceParams = setFinalFilterData(this.filterData);
    if (performanceParams['userId']) {
      this.performanceParams['userList'] = performanceParams['userId'];
    } else {
      delete this.performanceParams['userList'];
    }
    if (performanceParams['deptName']) {
      this.performanceParams['queryDeptId'] = performanceParams['deptName'];
    } else {
      delete this.performanceParams['queryDeptId'];
    }

    this.performanceParams['pageNo'] = this.pageIndex;
    this.performanceParams['pageSize'] = this.pageSize;
  }

  /**
   * 获取表格数据
   */
  getQueryDaliyTimeACTVOs() {
    this.loading = this.commonrearform.loading = true;
    this.setPerformanceParams();
    this.subscribeAll$['getQueryDaliyTimeACTVOs$'] = this.rearendRealTimeReportService.getQueryDaliyTimeACTVOs(this.performanceParams).subscribe(res => {
      this.displayData = res.result.list || [];
      this.total = res.result.total;
      this.loading = this.commonrearform.loading = false;
    }, () => {
      this.loading = this.commonrearform.loading = false;
    });
  }


  /**
   * 自营业绩导出
   */
  exportDaliyTimeACTVOs() {
    const params = {};
    const includesArr = ['pageNo', 'pageSize'];
    for (const key in this.performanceParams) {
      if (this.performanceParams.hasOwnProperty(key)) {
        const element = this.performanceParams[key];
        if (!includesArr.includes(key)) {
          params[key] = element;
        }
      }
    }
    this.rearendRealTimeReportService.exportDaliyTimeACTVOs({ ...params });
  }



  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }

}
