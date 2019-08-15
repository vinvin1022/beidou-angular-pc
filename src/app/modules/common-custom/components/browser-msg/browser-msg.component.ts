import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonCustomService } from '../../service/common-custom.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-browser-msg',
  templateUrl: './browser-msg.component.html',
  styleUrls: ['./browser-msg.component.scss']
})
export class BrowserMsgComponent implements OnInit {
  @ViewChild('broserMsg', { static: false }) broserMsg: TemplateRef<any>;
  public id;
  constructor(private commonCustomService: CommonCustomService, private notificationService: NzNotificationService) { }

  ngOnInit() {
    this.ifBroser();
  }

  downloadChrome(e) {
    this.notificationService.remove();
  }

  ifBroser() {
    const browserInfo = this.commonCustomService.getBrowserInfo();
    if (browserInfo['browserType'] !== '谷歌') {
      this.id = this.notificationService.template(this.broserMsg, {
        nzDuration: 0,
        nzStyle: {
          'text-align': 'center'
        }
      });
    }
  }

}
