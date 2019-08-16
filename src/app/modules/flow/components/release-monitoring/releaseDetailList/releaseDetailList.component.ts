import { Component, OnInit, Input } from '@angular/core';
import { FlowService } from '../../../service/flow.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ReleaseMonitoringService } from '../../../service/release-monitoring.service';

@Component({
  selector: 'app-release-detail-list',
  templateUrl: './releaseDetailList.component.html',
  styleUrls: ['./releaseDetailList.component.scss']
})
export class ReleaseDetailListComponent implements OnInit {
  @Input() reportDimensionParams = {};
  @Input() flowDataType = '电销';
  @Input() rowData: object = {};
  @Input() filterData;
  public displayData: Array<any> = [];
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public loading = false;
  public flowViewReport$;
  public isVisible = false;
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public filterFieldData = {};
  public widthConfig: Array<string> = [
    '50px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px'];
  public scrollConfig: object = { x: '5150px', y: '500px' };
  constructor(private releaseMonitoring: ReleaseMonitoringService, private flowService: FlowService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit() { this.setWidthScrollConfig(); }


  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren['length'], ['50px', '100px', '100px']);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }
  pageIndexChange(pageIndex) {
    this.getDetailLaunchMonitor();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getDetailLaunchMonitor();
  }
  getDetailLaunchMonitor() {
    this.loading = true;
    const params = {
      dimensionValue: this.rowData['dimensionValue'],
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };
    this.releaseMonitoring.getDetailLaunchMonitor(Object.assign(this.reportDimensionParams, params)).subscribe(res => {
      // const newlist = this.flowService.yingshe(res.result.list || [], this.filterData);
      const newlist = res.result.list || [];
      this.displayData = this.commonCustomService.plusPercentageColomn(newlist, this.releaseMonitoring.plusPercentage);
      this.total = res.result.total;
      this.loading = false;
    });
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
    this.getDetailLaunchMonitor();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
