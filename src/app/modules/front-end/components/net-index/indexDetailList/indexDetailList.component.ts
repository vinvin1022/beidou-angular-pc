import { Component, OnInit, Input } from '@angular/core';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ElectricControlService } from '../../../service/electriccontrol.service';
import { NetindexService } from '../../../service/netindex.service';
import { TableTreeService } from 'src/app/service/table-tree.service';

@Component({
  selector: 'app-index-detail-list',
  templateUrl: './indexDetailList.component.html',
  styleUrls: ['./indexDetailList.component.scss']
})
export class IndexDetailListComponent implements OnInit {
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
  public widthConfig: Array<string> = [];
  public scrollConfig: object = { x: '1000px', y: '500px' };
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public filterFieldData = {};
  constructor(private netindexService: NetindexService, private tableTreeService: TableTreeService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit() {}


  pageIndexChange(pageIndex) {
    this.getDivisionNetSaleDetail();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getDivisionNetSaleDetail();
  }
  getDivisionNetSaleDetail() {
    this.loading = true;
    const { plusPercentage, formatTime } = this.netindexService;
    const params = this.setDimensionParams();
    this.setWidthScrollConfig();
    this.netindexService.getDivisionNetSaleDetail(this.setUrl(), params)
      .subscribe(res => {
        this.displayData = this.commonCustomService.plusPercentageColomn(res.result.list, plusPercentage, formatTime);
        this.total = res.result.total;
        this.loading = false;
      });
  }

  setUrl() {
    let url = 'dms/frond/divisionNetSaleDetail';
    switch (this.rowData['level']) {
      case 0:
        url = 'dms/frond/divisionNetSaleDetail';
        break;
      case 1:
        url = 'dms/frond/legionNetSaleDetail';
        break;
      case 2:
        url = 'dms/frond/formNetSaleDetail';
        break;
      case 3:
        url = 'dms/frond/userNetSaleDetail';
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
    this.getDivisionNetSaleDetail();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length + 2);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }


}
