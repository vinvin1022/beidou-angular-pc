import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import nodes from './nodesData';
import { NzFormatEmitEvent } from 'ng-zorro-antd';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  @Input() treeNodes: Array<any> = [];
  @Output() sendSaveUserDateParams: EventEmitter<object> = new EventEmitter();
  @Input() defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  public searchValue;
  constructor() { }

  ngOnInit() { }


  nzEvent(event: NzFormatEmitEvent): void {
    if (event['eventName'] === 'check') {
      this.sendSaveUserDateParams.emit(event);
    }
  }
}
