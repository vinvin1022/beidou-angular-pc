import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { EmployedPerformanceService } from '../../../service/employedPerformance.service';
import { CommonrearformService } from '../../../service/commonrearform.service';
import { setFinalFilterData } from '../../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

@Component({
  selector: 'app-subselfemployed-table',
  templateUrl: './subselfemployed-table.component.html',
  styleUrls: ['./subselfemployed-table.component.scss']
})
export class SubselfemployedTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public performanceParams: object = {};
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public subscribeAll$: object = {};

  public displayData = [];


  public sortMap = {
    periodWid: null,
    performance: null,
    convertPerformance: null,
    bonus: null
  };
  public sortName = null;
  public sortValue = null;
  constructor(private employedPerformance: EmployedPerformanceService,
    private commonrearform: CommonrearformService,
    private commonCustomService: CommonCustomService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.pageIndex = 1;
      this.getSelfPerformance();
    }
  }
  ngOnInit() {
    // this._setDataTable();
  }

  pageIndexChange(pageIndex) {
    this.getSelfPerformance();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getSelfPerformance();
  }

  /**
   * 设置查询参数
   */
  setPerformanceParams() {
    this.performanceParams = setFinalFilterData(this.filterData);
    this.performanceParams['pageNo'] = this.pageIndex;
    this.performanceParams['pageSize'] = this.pageSize;
  }

  /**
   * 获取表格数据
   */
  getSelfPerformance() {
    this.loading = this.commonrearform.loading = true;
    this.setPerformanceParams();
    this.subscribeAll$['getSelfPerformance$'] = this.employedPerformance.getSelfPerformance(this.performanceParams).subscribe(res => {
      const newList = res.result.list.map((value) => {
        value['deptNameLabel'] = this.performanceParams['deptNameLabel'] || '';
        return value;
      });
      this.displayData = newList;
      this.total = res.result.total;
      this.loading = this.commonrearform.loading = false;
    }, () => {
      this.loading = this.commonrearform.loading = false;
    });
  }


  /**
   * 自营业绩导出
   */
  exportSelfPerformance() {
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
    this.employedPerformance.exportSelfPerformance({ ...params });
  }

  /**
   * @param sortName String  排序名称
   * @param value String  排序类型（升序，降序）
   */
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.sortMap) {
      if (this.sortMap.hasOwnProperty(key)) {
        this.sortMap[key] = (key === sortName ? value : null);
      }
    }
    if (this.sortName && this.sortValue) {
      this.displayData = [...this.displayData.sort((a, b) =>
        (this.sortValue === 'ascend') ?
          (a[this.sortName] > b[this.sortName] ? 1 : -1) :
          (b[this.sortName] > a[this.sortName] ? 1 : -1)
      )];
    } else {
      this.displayData = [...this.displayData];
    }
  }



  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }

}
