import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';





@Injectable()
export class RequestService {
  constructor(private request: HttpClient, public nzMessage: NzMessageService) { }
  get(url, params, config = {}): Observable<any> {
    if (params) {
      config['params'] = params;
    }
    // return this.request.get(url, config).pipe(catchError(this.handleError));
    return this.request.get(url, config);

  }
  post(url, params, config = {}): Observable<any> {
    // return this.request.post(url, params, config).pipe(catchError(this.handleError));
    return this.request.post(url, params, config);
  }

  /**
   * 导出文件
   * @param url 导出请求url
   * @param params 导出请求参数
   */
  exportExcel(url, params) {
    const token = sessionStorage.getItem('token').replace(/\+/g, '%2B');
    const ymurl = environment.path + url;
    const values = []; // 定义一个数组用来接受value
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].map(item => {
            item = item.toString().replace(/\+/g, '%2B');
            return item;
          });
        } else if (typeof params[key] === 'string') {
          params[key] = params[key].replace(/\+/g, '%2B');
        }
        values.push(key + '=' + params[key]);
      }
    }
    values.push(`token=${token}`);
    const openUrl = `${ymurl}?${values.join('&')}`;
    console.log(openUrl);
    window.open(openUrl);
  }


  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.log(error);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(error);
  // }

}
