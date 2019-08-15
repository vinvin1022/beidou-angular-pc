import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traffic-real-time-report',
  templateUrl: './traffic-real-time-report.component.html',
  styleUrls: ['./traffic-real-time-report.component.scss']
})
export class TrafficRealTimeReportComponent implements OnInit {

  public filterData: Object;
  public packagePermissions: String = 'b030101';
  constructor() { }

  ngOnInit() {}

  getQueryData(data) {
    this.filterData = data;
  }
}
