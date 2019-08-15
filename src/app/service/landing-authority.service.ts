import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { ConfirmModalService } from './confirm-modal.service';
@Injectable()
export class LandingAuthorityService {
  private firstFlag = true;
  constructor(private router: Router, private message: NzMessageService, private confirmModalService: ConfirmModalService) { }
  isLoggin(): boolean {
    const isLogin = sessionStorage.getItem('token');
    return !!isLogin;
  }
  clearInfoMessage(): void {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('menu');
    sessionStorage.removeItem('buttonList');
  }

  /**
   * 当前url是否有权限访问
   * @param url string 当前url
   * @returns boolean
   */
  existingMenuPermissions(url: string): boolean {
    const menus = JSON.parse(sessionStorage.getItem('menu'));
    const paths = [];
    if (Array.isArray(menus)) {
      menus.forEach(parentItem => {
        paths.push(parentItem.menuUrl);
        if (parentItem.children) {
          parentItem.children.forEach(subItem => {
            paths.push(subItem.menuUrl);
          });
        }
      });
    }
    if (paths.includes(url)) {
      return true;
    }
    return false;
  }


  /**
   * 跳转到默认页面
   * @param menuList Array 菜单列表
   */
  toDefaultPage(): Boolean {
    const menus = JSON.parse(sessionStorage.getItem('menu'));
    const mn = menus && menus[0];
    let redirectToUrl = '/login';
    if (!mn) {
      if (!this.firstFlag) {
        this.confirmModalService.showConfirm('您没有菜单权限，请先联系管理员后，登陆获取！', () => {
          location.href = `${environment['authority_url']}`;
        });
      }
      this.firstFlag = false;
      return false;
    }
    if (mn.children && mn.children[0].menuUrl) {
      redirectToUrl = mn.children[0].menuUrl;
    } else if (mn.menuUrl) {
      redirectToUrl = mn.menuUrl;
    }
    this.firstFlag = false;
    this.router.navigate([redirectToUrl]);
  }

}
