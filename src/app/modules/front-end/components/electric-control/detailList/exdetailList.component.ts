import { Component, OnInit, Input } from '@angular/core';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ElectricControlService } from '../../../service/electriccontrol.service';
import { TableTreeService } from 'src/app/service/table-tree.service';

@Component({
  selector: 'app-exdetail-list',
  templateUrl: './exdetailList.component.html',
  styleUrls: ['./exdetailList.component.scss']
})
export class ExDetailListComponent implements OnInit {
  @Input() reportDimensionParams = {};
  @Input() newFlowDataType = '电销';
  @Input() rowData: object = {};
  public filterFieldData = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public displayData: Array<any> = [];
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public loading = false;
  public flowViewReport$;
  public isVisible = false;
  public widthConfig: Array<any> = [];
  public scrollConfig: object = {};
  constructor(private electricControlService: ElectricControlService, private tableTreeService: TableTreeService,
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
    const { plusPercentageday, plusPercentagemonth, formatTime } = this.electricControlService;
    let plusPercentage = plusPercentageday;
    const params = this.setDimensionParams();
    this.setWidthScrollConfig();
    plusPercentage = params['periodType'] === 'period_wid' ? plusPercentageday : plusPercentagemonth;
    this.electricControlService.getDetailDivision(this.setUrl(), params)
      .subscribe(res => {
        this.displayData = this.commonCustomService.plusPercentageColomn(res.result.list, plusPercentage, formatTime);
        this.total = res.result.total;
        this.loading = false;
      });
  }

  setUrl() {
    let url = 'dms/frond/detailDivision';
    switch (this.rowData['level']) {
      case 0:
        url = 'dms/frond/detailDivision';
        break;
      case 1:
        url = 'dms/frond/detailLegion';
        break;
      case 2:
        url = 'dms/frond/detailForm';
        break;
      case 3:
        url = 'dms/frond/detailUser';
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
    this.getDetailDivision();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'] + 2);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }
}
