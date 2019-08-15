import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-business-processing',
  templateUrl: './business-processing.component.html',
  styleUrls: ['./business-processing.component.scss']
})
export class BusinessProcessingComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
