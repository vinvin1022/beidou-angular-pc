import { Component, OnInit, Input } from '@angular/core';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ElectricstatisticsService } from '../../../service/electricstatistics.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { electricStatisticsFieldData } from '../../../service/electric-statisticsFieldData';

@Component({
  selector: 'app-elstatdetail-list',
  templateUrl: './elstatdetailList.component.html',
  styleUrls: ['./elstatdetailList.component.scss']
})
export class ElstatDetailListComponent implements OnInit {
  @Input() reportDimensionParams = {};
  public rowData: Object = {};
  public displayData: Array<any> = [];
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public loading: Boolean = false;
  public filterFieldData: object = {};
  public allChildren = [];
  public fieldKeys = [];
  public flowViewReport$;
  public isVisible = false;
  public widthConfig: Array<string> = [];
  public scrollConfig: object = { x: '1000px', y: '500px' };
  constructor(private electricstatisticsService: ElectricstatisticsService, private tableTreeService: TableTreeService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit() {
    this.setWidthScrollConfig();
  }


  pageIndexChange(pageIndex) {
    this.getDetailDivision();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getDetailDivision();
  }
  getDetailDivision() {
    this.loading = true;
    const { plusPercentage } = this.electricstatisticsService;
    const params = this.setDimensionParams();
    this.electricstatisticsService[this.setRequestMethod()](params)
      .subscribe(res => {
        this.displayData = this.commonCustomService.plusPercentageColomn(res.result.list, plusPercentage);
        this.total = res.result.total;
        this.loading = false;
      });
  }

  setRequestMethod() {
    let name = 'getDetailTargetDivision';
    switch (this.rowData['level']) {
      case 0:
        name = 'getDetailTargetDivision';
        break;
      case 1:
        name = 'getDetailDimension';
        break;
    }
    return name;
  }

  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['100px', '100px']);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }


  setDimensionParams() {
    const params = {
      queryValue: this.rowData['userId'],
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };
    return Object.assign({}, this.reportDimensionParams, params, { ...this.tableTreeService._getdlist(this.rowData) });
  }

  showModal(rowData, filterFieldData, allChildren): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.isVisible = true;
    this.rowData = rowData;
    this.filterFieldData = filterFieldData;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = allChildren;
    this.setWidthScrollConfig();
    this.getDetailDivision();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
