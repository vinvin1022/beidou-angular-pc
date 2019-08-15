import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-situation-of-business',
  templateUrl: './situation-of-business.component.html',
  styleUrls: ['./situation-of-business.component.scss']
})
export class SituationOfBusinessComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
