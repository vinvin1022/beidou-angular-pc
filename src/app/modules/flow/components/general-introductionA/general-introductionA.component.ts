import { Component, OnInit, ViewChild } from '@angular/core';
import { GensearchCriteriaComponent } from './gensearch-criteria/gensearch-criteria.component';

@Component({
  selector: 'app-general-introductiona',
  templateUrl: './general-introductionA.component.html',
  styleUrls: ['./general-introductionA.component.scss']
})
export class GeneralIntroductionAComponent implements OnInit {
  public filterData: object;
  public packagePermissions = 'b030101';
  constructor() { }

  ngOnInit() { }

  getQueryData(data) {
    this.filterData = data;
  }

}
