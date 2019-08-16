import { Component, OnInit, Input } from '@angular/core';
import { GeneralIntroductionService } from '../../../service/general-introduction.service';
import { FlowService } from '../../../service/flow.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detailList.component.html',
  styleUrls: ['./detailList.component.scss']
})
export class DetailListComponent implements OnInit {
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
  constructor(private generalIntroduction: GeneralIntroductionService, private flowService: FlowService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit() { }


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
      dimensionValue: this.rowData['dimensionValue'],
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };
    this.generalIntroduction.reportDimension(Object.assign(this.reportDimensionParams, params)).subscribe(res => {
      const newlist = this.flowService.yingshe(res.result.list || [], this.filterData);
      this.displayData = this.commonCustomService.plusPercentageColomn(newlist, this.generalIntroduction.plusPercentage);
      this.total = res.result.total;
      this.loading = false;
    });
  }

  showModal(rowData): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.isVisible = true;
    // if (this.rowData['dimensionValue'] !== rowData['dimensionValue']) {
    //   this.rowData = rowData;
    //   this.reportDimension();
    // }
    this.rowData = rowData;
    this.reportDimension();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
