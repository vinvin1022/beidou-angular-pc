import { Component, OnInit } from '@angular/core';
import { workOrderReportCustomFieldData } from '../../service/work-order-reportCustomFieldData';
import { WorkOrderReportService } from '../../service/work-order-report.service';

@Component({
  selector: 'app-work-order-report',
  templateUrl: './work-order-report.component.html',
  styleUrls: ['./work-order-report.component.scss']
})
export class WorkOrderReportComponent implements OnInit {
  public filterData;
  public serviceNameClass;
  public methodName;
  public tableFields;
  public treeFields;
  public exportMethod;
  public bigId;
  constructor(private _workOrderReportService: WorkOrderReportService) { }

  ngOnInit() {
    this.serviceNameClass = this._workOrderReportService;
    this.methodName = 'queryAfterSale';
    this.tableFields = workOrderReportCustomFieldData;
    this.treeFields = ['chooseId', 'chooseId', 'chooseId', 'chooseId'];
    this.exportMethod = 'exportDailyWorkOrders';

  }
  getFilterData(data) {
    this.filterData = { ...data };
    console.log(this.filterData);
  }
  getBigId(bigId) {
    this.bigId = bigId;
  }

}
