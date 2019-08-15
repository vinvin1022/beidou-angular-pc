import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-net-index',
  templateUrl: './net-index.component.html',
  styleUrls: ['./net-index.component.scss']
})
export class NetIndexComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
