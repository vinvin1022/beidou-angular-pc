import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pandect',
  templateUrl: './pandect.component.html',
  styleUrls: ['./pandect.component.scss']
})
export class PandectComponent implements OnInit {
  public filterData;
  constructor() { }

  ngOnInit() {
  }


  getQueryData(data) {
    this.filterData = data;
  }

}
