import { Component, OnInit, ViewEncapsulation, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-data-block',
  templateUrl: './data-block.component.html',
  styleUrls: ['./data-block.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataBlockComponent implements OnInit, OnChanges {
  @Input('realTimeData') realTimeData;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
