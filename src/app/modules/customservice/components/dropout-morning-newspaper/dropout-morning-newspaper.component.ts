import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropout-morning-newspaper',
  templateUrl: './dropout-morning-newspaper.component.html',
  styleUrls: ['./dropout-morning-newspaper.component.scss']
})
export class DropoutMorningNewspaperComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

}
