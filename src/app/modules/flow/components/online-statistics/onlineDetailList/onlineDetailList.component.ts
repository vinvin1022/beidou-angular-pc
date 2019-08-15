import { Component, OnInit, Input } from '@angular/core';
import { FlowService } from '../../../service/flow.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { OnlineStatisticsService } from '../../../service/online-statistics.service';
import { onlineStatisticsCustomFieldData } from '../../../service/onlineStatisticsCustomFieldData';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';

@Component({
  selector: 'app-online-detail-list',
  templateUrl: './onlineDetailList.component.html',
  styleUrls: ['./onlineDetailList.component.scss']
})
export class OnlineDetailListComponent implements OnInit {
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
  public fieldKeys: Array<string> = [];
  public onlineStatisticsCustomFieldData: Array<object>;
  public widthConfig: Array<string> = [
    '160px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'
  ];
  public scrollConfig: Object = { x: '1460px', y: '500px' };
  constructor(private onlineStatistics: OnlineStatisticsService, private flowService: FlowService,
     private commonCustomService: CommonCustomService, private customColumnDialogService: CustomColumnDialogService) { }

  ngOnInit() {
    this.onlineStatisticsCustomFieldData = onlineStatisticsCustomFieldData.ctrolData.children;
    this.setWidthScrollConfig();
  }


  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['160px', '100px']);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }



  pageIndexChange(pageIndex) {
    this.reportDimension();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.reportDimension();
  }
  reportDimension() {
    this.loading = true;
    const params = {
      queryValue: this.rowData['key'],
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };
    this.onlineStatistics.getDetail(this.setUrl(), Object.assign({}, this.reportDimensionParams, params)).subscribe(res => {
      const newlist = this.flowService.yingshe(res.result.list || [], this.filterData);
      this.displayData = this.commonCustomService.plusPercentageColomn(newlist, this.onlineStatistics.plusPercentage);
      this.total = res.result.total;
      this.loading = false;
    });
  }
  setUrl() {
    let url = 'dms/view/detailDeptOnline';
    switch (this.rowData['level']) {
      case 0:
        url = 'dms/view/detailDeptOnline';
        break;
      case 1:
        url = 'dms/view/detailUserOnline';
        break;
    }
    return url;
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
    this.reportDimension();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
