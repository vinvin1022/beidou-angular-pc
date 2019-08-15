import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-transaction-periodic',
  templateUrl: './flow-transaction-periodic.component.html',
  styleUrls: ['./flow-transaction-periodic.component.scss']
})
export class FlowTransactionPeriodicComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
