import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-army-flow-analysis',
  templateUrl: './army-flow-analysis.component.html',
  styleUrls: ['./army-flow-analysis.component.scss']
})
export class ArmyFlowAnalysisComponent implements OnInit {

  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
