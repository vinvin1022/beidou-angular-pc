import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-employed-performance',
  templateUrl: './self-employed-performance.component.html',
  styleUrls: ['./self-employed-performance.component.scss']
})
export class SelfEmployedPerformanceComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
