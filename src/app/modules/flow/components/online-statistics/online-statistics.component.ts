import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-online-statistics',
  templateUrl: './online-statistics.component.html',
  styleUrls: ['./online-statistics.component.scss']
})
export class OnlineStatisticsComponent implements OnInit {

  public searchData;
  constructor() { }
  ngOnInit(): void { }
  acceptSearchData(data) {
    this.searchData = data;
  }
}
