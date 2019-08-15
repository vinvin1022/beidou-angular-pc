import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complaints-monitoring',
  templateUrl: './complaints-monitoring.component.html',
  styleUrls: ['./complaints-monitoring.component.scss']
})
export class ComplaintsMonitoringComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
