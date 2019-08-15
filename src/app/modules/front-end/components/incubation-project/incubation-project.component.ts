import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incubation-project',
  templateUrl: './incubation-project.component.html',
  styleUrls: ['./incubation-project.component.scss']
})
export class IncubationProjectComponent implements OnInit {
  public filterData = null;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
