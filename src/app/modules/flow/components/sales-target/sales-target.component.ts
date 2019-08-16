import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-target',
  templateUrl: './sales-target.component.html',
  styleUrls: ['./sales-target.component.scss']
})
export class SalesTargetComponent implements OnInit {
  public packagePermissions = 'b030302';

  public filterData: object;
  constructor() { }

  ngOnInit() {
  }
  getQueryData(data) {
    this.filterData = data;
  }

}
