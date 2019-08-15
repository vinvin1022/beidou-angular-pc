import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-hours',
  templateUrl: './daily-hours.component.html',
  styleUrls: ['./daily-hours.component.scss']
})
export class DailyHoursComponent implements OnInit {

  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
