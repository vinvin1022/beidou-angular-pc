import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { OnlineStatisticsService } from '../../../service/online-statistics.service';
import { ExpansionDerivationService } from '../../../service/expansion-derivation.service';

@Component({
  selector: 'app-subderivation-table',
  templateUrl: './subderivation-table.component.html',
  styleUrls: ['./subderivation-table.component.scss']
})
export class SubderivationTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  public dataTable = [];
  public pageSizeList: Array<number> = [10, 20, 30, 40, 50];
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public loading = false;
  public conditionsParams: object = {};

  constructor(private expansionDerivation: ExpansionDerivationService) { }


  exportSpreadPlanExport() {
    this.expansionDerivation.exportSpreadPlanExport(this.filterData);
  }
  getConditionsTable(params) {
    this.loading = this.expansionDerivation.loading = true;
    const config = {
      pageSize: this.pageSize,
      pageNum: this.pageIndex
    };
    this.expansionDerivation.getConditions(Object.assign(params, config)).subscribe(res => {
      this.total = res.data.total;
      this.dataTable = res.data.list;
      this.loading = this.expansionDerivation.loading = false;
    }, () => {
      this.loading = this.expansionDerivation.loading = false;
    });
  }


  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.pageSize = pageSize;
    this.getConditionsTable(this.filterData);
  }

  pageNoChange(pageNumber) {
    this.pageIndex = pageNumber;
    this.getConditionsTable(this.filterData);
  }

  ngOnChanges(x: SimpleChanges) {
    if (this.filterData) {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getConditionsTable(this.filterData);
    }
  }
  ngOnInit() { }
  ngOnDestroy() {
    this.loading = this.expansionDerivation.loading = false;
  }

}
