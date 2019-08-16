import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-release-monitoring',
  templateUrl: './release-monitoring.component.html',
  styleUrls: ['./release-monitoring.component.scss']
})
export class ReleaseMonitoringComponent implements OnInit {
  public packagePermissions = 'b030402';

  public filterData: object;
  constructor() { }

  ngOnInit() {
  }
  getQueryData(data) {
    this.filterData = data;
  }

}
