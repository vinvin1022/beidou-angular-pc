import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-eye-card',
  templateUrl: './eye-card.component.html',
  styleUrls: ['./eye-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EyeCardComponent implements OnInit {
  @Input() nztitle: String = '实时看板x';
  constructor() { }

  ngOnInit() {
  }

}
