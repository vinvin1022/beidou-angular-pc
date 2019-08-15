import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-army-data-analysis',
  templateUrl: './army-data-analysis.component.html',
  styleUrls: ['./army-data-analysis.component.scss']
})
export class ArmyDataAnalysisComponent implements OnInit {

  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
