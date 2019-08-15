import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-electric-control',
  templateUrl: './electric-control.component.html',
  styleUrls: ['./electric-control.component.scss']
})
export class ElectricControlComponent implements OnInit {
  public filterData = null;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
