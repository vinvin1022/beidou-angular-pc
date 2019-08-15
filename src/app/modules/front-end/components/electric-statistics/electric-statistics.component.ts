import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-electric-statistics',
  templateUrl: './electric-statistics.component.html',
  styleUrls: ['./electric-statistics.component.scss']
})
export class ElectricStatisticsComponent implements OnInit {

  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
