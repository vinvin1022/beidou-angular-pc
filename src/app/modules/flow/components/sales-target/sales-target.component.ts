import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-target',
  templateUrl: './sales-target.component.html',
  styleUrls: ['./sales-target.component.scss']
})
export class SalesTargetComponent implements OnInit {
  public packagePermissions: String = 'b030302';

  public filterData: Object;
  constructor() { }

  ngOnInit() {
  }
  getQueryData(data) {
    this.filterData = data;
  }

}
