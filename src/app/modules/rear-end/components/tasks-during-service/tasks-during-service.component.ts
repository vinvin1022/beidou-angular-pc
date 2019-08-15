import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks-during-service',
  templateUrl: './tasks-during-service.component.html',
  styleUrls: ['./tasks-during-service.component.scss']
})
export class TasksDuringServiceComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
