import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-effectiveness',
  templateUrl: './effectiveness.component.html',
  styleUrls: ['./effectiveness.component.scss']
})
export class EffectivenessComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }

  goback() {
    history.go(-1);
  }

}
