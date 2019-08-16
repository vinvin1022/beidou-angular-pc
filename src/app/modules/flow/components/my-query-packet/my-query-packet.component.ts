import { Component, OnInit, Input } from '@angular/core';
import { MyquerypacketService } from '../../service/myquerypacket.service';
import { FlowcommonformService } from '../../service/flowcommonform.service';


@Component({
  selector: 'app-my-query-packet',
  templateUrl: './my-query-packet.component.html',
  styleUrls: ['./my-query-packet.component.scss']
})
export class MyQueryPacketComponent implements OnInit {
  @Input() authority: object;
  public filterData: object;
  constructor(private flowcommonform: FlowcommonformService,
    private myquerypacketService: MyquerypacketService) { }

  ngOnInit() {
    this.getQueryAccountAll();
  }


  getQueryData(data) {
    this.filterData = data;
  }

  getQueryAccountAll() {
    // 推广账户
    this.flowcommonform.getQueryAccount({ searchVal: 'all' }).subscribe(result => {
      this.myquerypacketService.accountUidOptionsAll = result['result'];
    });
    // 推广站点
    this.flowcommonform.getSiteNumberOptions({ searchVal: 'all' }).subscribe(result => {
      this.myquerypacketService.siteNumberOptionsAll = result['result'];
    });
  }
}

