import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


import { NzMessageService } from 'ng-zorro-antd';
import { LandingAuthorityService } from './landing-authority.service';
import { environment } from 'src/environments/environment';
import { ConfirmModalService } from './confirm-modal.service';
@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private route: Router, private routeInfo: ActivatedRoute, private message: NzMessageService,
    private landingAuthorityService: LandingAuthorityService, private confirmModalService: ConfirmModalService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = environment.path + req.url;
    const token = sessionStorage.getItem('token');
    const proId = sessionStorage.getItem('proId');

    const reqObject = { url };
    if (token) {
      reqObject['headers'] = new HttpHeaders({
        'token': token,
        'proId': proId
      });
    }
    req = req.clone(reqObject); // 这里可以在请求中加参数

    return next.handle(req).pipe(mergeMap((event: any) => {
      // 正常返回，处理具体返回参数
      if (event instanceof HttpResponse && event.status === 200) {
        return this._handleCorrectly(event);
      }
      return of(event);
    }),
      catchError((err: HttpErrorResponse) => this._handleErrorData(err)));
  }

  private _handleCorrectly(event: HttpResponse<any>): Observable<any> {
    const body: any = event.body;
    switch (body && body.code) {
      case 900401:
        // this.showError(`${900401}  ${'登录校验失败或过期，请您重新登录！'}`);
        this.landingAuthorityService.clearInfoMessage();
        // this.route.navigate(['/login']);
        this.confirmModalService.showConfirm('登录校验失败或过期，请您重新登录！', () => {
          location.href = `${environment['authority_url']}`;
        });
        break;
      case 510:
        this.showError(`${510}  ${'数据操作异常，请稍后再试'}`);
        break;
      case 500:
        this.showError(`${500}  ${body.text}`);
        break;
      case 504:
        this.showError(`${504}  ${body.text}`);
        break;
      case 10002:
        this.showError(`${10002}  ${body.text}`, 'warning');
        break;
      case 42001001:
        this.showError(`${42001001}  查询失败`, 'warning');
        break;
      default:
        return of(event);
    }
    return of(event);
  }


  private _handleErrorData(event: HttpErrorResponse): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 401: // 未登录状态码
        // this.route.navigate(['/login']);
        this.confirmModalService.showConfirm('你还没登陆，请先登陆！', () => {
          location.href = `${environment['authority_url']}`;
        });
        break;
      case 400:
        if (event instanceof HttpErrorResponse) {
          this.showError(`${event.error['status']} ${event.error['path']} ${event.error['error']}`);
          throw event.error;
        }
        break;
      case 404:
        if (event instanceof HttpErrorResponse) {
          this.showError(`${event.error['status']} ${event.error['path']} ${event.error['error']} 找不到请求地址！`);
          throw event.error;
        }
        break;
      case 405:
        if (event instanceof HttpErrorResponse) {
          this.showError(`${event.error['status']} ${event.error['path']} ${event.error['error']} 请求类型不允许！`);
          throw event.error;
        }
        break;
      case 0:
        if (event instanceof HttpErrorResponse) {
          this.showError(`请求服务器超时`);
          throw event.error;
        }
        break;
      case 500:
        if (event instanceof HttpErrorResponse) {
          this.showError(`${event.error['status']}  ${event.error['error']}`);
          throw event.error;
        }
        break;
      case 510:
        if (event instanceof HttpErrorResponse) {
          this.showError(`${event.error['status']}  ${event.error['error']}`);
          throw event.error;
        }
        break;
      default:
        return of(event);
    }
  }

  private showError(message, type = 'error') {
    // this.message.remove();
    this.message[type](message, { nzDuration: 5000 });
  }
}
