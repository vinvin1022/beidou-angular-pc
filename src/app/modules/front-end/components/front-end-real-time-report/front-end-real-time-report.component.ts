import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-front-end-real-time-report',
  templateUrl: './front-end-real-time-report.component.html',
  styleUrls: ['./front-end-real-time-report.component.scss']
})
export class FrontEndRealTimeReportComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
