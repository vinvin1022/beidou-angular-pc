import { Component, OnInit } from '@angular/core';
import { dailyReachRateCustomFieldData } from '../../service/daily-reach-rateCustomFieldData';
import { DailyReachRateService } from '../../service/daily-reach-rate.service';

@Component({
  selector: 'app-daily-reach-rate',
  templateUrl: './daily-reach-rate.component.html',
  styleUrls: ['./daily-reach-rate.component.scss']
})
export class DailyReachRateComponent implements OnInit {
  public filterData;
  public serviceNameClass;
  public methodName;
  public tableFields;
  public treeFields;
  public exportMethod;
  constructor(private dailyReachRateService: DailyReachRateService) { }

  ngOnInit() {
    this.serviceNameClass = this.dailyReachRateService;
    this.methodName = 'dailyReachRateQueryVO';
    this.tableFields = dailyReachRateCustomFieldData;
    this.treeFields = ['chooseId', 'chooseId', 'chooseId', 'chooseId'];
    this.exportMethod = 'exportBackdailyReachRate';

  }
  getFilterData(data) {
    this.filterData = data;
    console.log(this.filterData);
  }



}
