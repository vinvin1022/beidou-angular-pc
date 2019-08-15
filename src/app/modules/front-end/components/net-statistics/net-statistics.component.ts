import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-net-statistics',
  templateUrl: './net-statistics.component.html',
  styleUrls: ['./net-statistics.component.scss']
})
export class NetStatisticsComponent implements OnInit {

  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
