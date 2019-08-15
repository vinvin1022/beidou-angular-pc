import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from './modules/login/sevice/login.service';
import { LandingAuthorityService } from './service/landing-authority.service';
import { RequestService } from './service/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private message: NzMessageService, private loginService: LoginService, private landingAuthorityService: LandingAuthorityService,
    private requestService: RequestService) { }
  private buttonList: Array<any> = [];
  ngOnInit() {
    // document.oncontextmenu = (evt) => {
    //   evt.preventDefault();
    // };
    // document.oncopy = (evt) => {
    //   this.message.info('禁止复制');
    //   evt.preventDefault();
    // };
    this.saveProId();
    this.queryUserInfo();
    this.getNavBd();
  }

  /**
   * 保存proId
   */
  saveProId() {
    this.requestService.post('dms/common/saveProId', { proId: sessionStorage.getItem('proId') }).subscribe(res => {

    });
  }




  /**
   * 获取导航菜单
   */
  queryUserInfo() {
    this.loginService.queryUserInfo().subscribe(res => {
      sessionStorage.setItem('userInfo', res.data && JSON.stringify(res.data));
    });
  }

  /**
   * 获取导航菜单
   */
  getNavBd() {
    this.loginService.getNavBd().subscribe(result => {
      sessionStorage.setItem('menu', JSON.stringify(result.data));
      this.settingButtonPermissions(result.data);
      sessionStorage.setItem('buttonList', JSON.stringify(this.buttonList));
      this.landingAuthorityService.toDefaultPage();
    });
  }



  settingButtonPermissions(obj) {
    if (obj && Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (item.children && Array.isArray(item.children)) {
          this.settingButtonPermissions(item.children);
        } else if (!item.children && !item.menuUrl) {
          this.buttonList.push(item);
        }
      });
    }
  }

}
