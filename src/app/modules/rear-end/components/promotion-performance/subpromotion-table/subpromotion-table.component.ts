import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { PromotionPerformanceService } from '../../../service/promotionPerformance.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { setFinalFilterData } from 'src/app/tools';
import { PromotionformService } from '../../../service/promotion-form.service';

@Component({
  selector: 'app-subpromotion-table',
  templateUrl: './subpromotion-table.component.html',
  styleUrls: ['./subpromotion-table.component.scss']
})
export class SubpromotionTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public performanceParams: Object = {};
  public loading: Boolean = false;
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public subscribeAll$: Object = {};

  public displayData = [];

  constructor(private promotionPerformanceService: PromotionPerformanceService,
    private promotionformService: PromotionformService,
    private commonCustomService: CommonCustomService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.pageIndex = 1;
      this.queryBackPromotion();
    }
  }
  ngOnInit() {
    // this._setDataTable();
  }

  pageIndexChange(pageIndex) {
    this.queryBackPromotion();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.queryBackPromotion();
  }

  /**
  * 设置查询参数
  */
  setPromotionParams() {
    this.performanceParams = setFinalFilterData(this.filterData);
    this.performanceParams['pageNo'] = this.pageIndex;
    this.performanceParams['pageSize'] = this.pageSize;
  }

  /**
   * 获取表格数据
   */
  queryBackPromotion() {
    this.loading = this.promotionformService.loading = true;
    this.setPromotionParams();
    this.subscribeAll$['queryBackPromotion$'] = this.promotionPerformanceService.queryBackPromotion(this.performanceParams).subscribe(res => {
      this.displayData = (res.result && res.result.list) || [];
      this.total = (res.result && res.result.total) || 0;
      this.loading = this.promotionformService.loading = false;
    }, () => {
      this.loading = this.promotionformService.loading = false;
    });
  }


  /**
   * 导出
   */
  exportPromotion() {
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

    this.promotionPerformanceService.saveBackQueryVO(params).subscribe(res => {
      this.promotionPerformanceService.exportBackPromotion({ ridesKey: res.result });
    });
  }


  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }

}
