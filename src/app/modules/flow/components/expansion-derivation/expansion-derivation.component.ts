import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expansion-derivation',
  templateUrl: './expansion-derivation.component.html',
  styleUrls: ['./expansion-derivation.component.scss']
})
export class ExpansionDerivationComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }
  getFilterData(data) {
    this.filterData = data;
  }
}
