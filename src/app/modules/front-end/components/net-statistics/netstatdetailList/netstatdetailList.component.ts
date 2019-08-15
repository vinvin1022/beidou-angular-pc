import { Component, OnInit, Input } from '@angular/core';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { NetstatisticsService } from '../../../service/netstatistics.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { netStatisticsFieldData } from '../../../service/netStatisticscolFieldData';


@Component({
  selector: 'app-netstatdetail-list',
  templateUrl: './netstatdetailList.component.html',
  styleUrls: ['./netstatdetailList.component.scss']
})
export class NetstatDetailListComponent implements OnInit {
  @Input() reportDimensionParams = {};
  @Input() newFlowDataType: String = '电销';
  @Input() rowData: Object = {};
  @Input() filterData;
  public displayData: Array<any> = [];
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public loading: Boolean = false;
  public flowViewReport$;
  public isVisible = false;
  public filterFieldData: object = {};
  public allChildren = [];
  public fieldKeys = [];
  public widthConfig = [];
  public scrollConfig: object = { x: '1000px', y: '500px' };
  public netStatisticsFieldData: Array<object> = [];

  constructor(private netstatisticsService: NetstatisticsService, private tableTreeService: TableTreeService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit() {
    this.netStatisticsFieldData = netStatisticsFieldData.controlData.children;
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
    const { plusPercentage } = this.netstatisticsService;
    const params = this.setDimensionParams();
    this.netstatisticsService.getDetailSaleProject(this.setUrl(), params)
      .subscribe(res => {
        this.displayData = this.commonCustomService.plusPercentageColomn(res.result.list, plusPercentage);
        this.total = res.result.total;
        this.loading = false;
      });
  }

  setUrl() {
    let url = 'dms/frond/detailSaleProject';
    switch (this.rowData['level']) {
      case 0:
        url = 'dms/frond/detailSaleProject';
        break;
      case 1:
        url = 'dms/frond/detailDimensionProject';
        break;
    }
    return url;
  }


  setDimensionParams() {
    const params = {
      queryValue: this.rowData['userId'],
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };
    return Object.assign({}, this.reportDimensionParams, params, {...this.tableTreeService._getdlist(this.rowData)});
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


  // setWidthConfig() {
  //   this.widthConfig = [];
  //   const length = this.netStatisticsFieldData.length + 2;
  //   for (let index = 0; index < length; index++) {
  //     this.widthConfig.push('100px');
  //   }
  // }

  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['100px', '100px']);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }


}
