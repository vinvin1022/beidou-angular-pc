import { Injectable } from '@angular/core';
import { RequestService } from '../../../service/request.service';
import { Observable } from 'rxjs';


@Injectable()
export class LoginService {
  private service = 'authentication';
  constructor(private request: RequestService) { }

  login(phone, password): Observable<any> {
    return this.request.post(`${this.service}/api/notcheck/signin`, { phone, password });
  }

  /**
   * 获取菜单
   */
  getNavBd(): Observable<any> {
    // return this.request.post(`${this.service}/menu/navBd`, {});
    return this.request.get(`${this.service}/menu/menuInfoById`, { proId: '3c47de5920aa443a87b1a98db2fd3557' });
  }


  /**
   * 根据token返回用户信息
   */
  queryUserInfo(): Observable<any> {
    // return this.request.post(`${this.service}/menu/navBd`, {});
    return this.request.get(`${this.service}/api/queryUserInfo`, {});
  }



}

