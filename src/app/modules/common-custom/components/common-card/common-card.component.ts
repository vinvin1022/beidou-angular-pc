import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-common-card',
  templateUrl: './common-card.component.html',
  styleUrls: ['./common-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonCardComponent implements OnInit {
  @Input() nztitle: String = 'card';
  @Input() isHideGrayBg: Boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
