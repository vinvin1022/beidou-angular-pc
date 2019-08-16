import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { CommonFormComponent } from '../common-form/common-form.component';

@Component({
  selector: 'app-general-introduction',
  templateUrl: './general-introduction.component.html',
  styleUrls: ['./general-introduction.component.scss']
})
export class GeneralIntroductionComponent implements OnInit {
  public filterData: object;
  public packagePermissions = 'b030702';
  @ViewChild('commonForm', { static: false }) commonForm: CommonFormComponent;
  constructor() { }

  ngOnInit() { }

  getQueryData(data) {
    this.filterData = data;
  }

}
