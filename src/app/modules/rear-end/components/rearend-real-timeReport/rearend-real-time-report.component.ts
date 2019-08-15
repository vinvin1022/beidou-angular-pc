import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rearend-real-time-report',
  templateUrl: './rearend-real-time-report.component.html',
  styleUrls: ['./rearend-real-time-report.component.scss']
})
export class RearendRealTimeReportComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
