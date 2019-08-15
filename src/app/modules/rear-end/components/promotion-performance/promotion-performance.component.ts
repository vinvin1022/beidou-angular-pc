import { Component, OnInit } from '@angular/core';
import { PromotionPerformanceService } from '../../service/promotionPerformance.service';
import { promotionPerformanceCustomFieldData } from '../../service/promotionPerformanceCustomFieldData';
import { setFinalFilterData } from 'src/app/tools';

@Component({
  selector: 'app-promotion-performance',
  templateUrl: './promotion-performance.component.html',
  styleUrls: ['./promotion-performance.component.scss']
})
export class PromotionPerformanceComponent implements OnInit {

  public filterData;
  public serviceNameClass;
  public methodName = 'queryBackPromotion';
  public tableFields = promotionPerformanceCustomFieldData;
  public exportMethod = 'exportBackPromotion';
  public saveBackQueryExport = 'saveBackQueryVO';
  public showFirstColumn = false;
  public showPagination = true;
  constructor(private promotionPerformanceService: PromotionPerformanceService) { }

  ngOnInit() {
    this.serviceNameClass = this.promotionPerformanceService;
  }

  getFilterData(data) {
    this.filterData = setFinalFilterData(data);
  }

}
