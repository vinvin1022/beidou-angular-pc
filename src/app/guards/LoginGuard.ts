import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, CanActivateChild, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { LandingAuthorityService } from '../service/landing-authority.service';
import { environment } from 'src/environments/environment';
import { ConfirmModalService } from '../service/confirm-modal.service';

@Injectable()
export class LoginGuard implements CanActivate {
  private buttonList: Array<any> = [];
  constructor(private router: Router, private landingAuthorityService: LandingAuthorityService, private route: ActivatedRoute,
    private confirmModalService: ConfirmModalService) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this.checkLogin(url);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }
  canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string) {


    if (this.landingAuthorityService.isLoggin()) {
      const hasPermiss = this.landingAuthorityService.existingMenuPermissions(url);
      if (url && !hasPermiss) {
        this.landingAuthorityService.toDefaultPage();
        return false;
      }
      return true;
    } else {
      // this.router.navigate(['/login']);

      this.confirmModalService.showConfirm('登录校验失败或过期，请您重新登录！', () => {
        location.href = `${environment['authority_url']}#/messageList`;
        return false;
      });
    }

  }



}
