import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class MyquerypacketService {
  constructor(private requestHttp: RequestService) { }
  public tableData: Array<any> = [];
  public total: Number = 0;
  public queryPackageFlag = false;  // 控制DoCheck钩子函数
  public loading: Boolean = false;
  public finallyParams: Object = {}; // 请求参数
  public siteNumberOptionsAll: Object;
  public accountUidOptionsAll: Object;


  public dialogDefalutData = {
    packageName: null,   // 查询包名称
    typeIdVal: '1',  // 查询包内容
    accountUid: [],
    siteNumber: []
  };
  public defalutData = {
    // 名称
    packageName: '',
    // 创建人
    createUser: '',
    // 类型
    typeId: '0',
    pageNo: 1,
    pageSize: 10
  };
  public typeIdValOptions: Array<Object> = [
    { typeId: '1', typeName: '推广站点' },
    { typeId: '2', typeName: '推广账户' }
  ];

  /**
   * 获取数据
   */
  _setTableData() {
    this.loading = true;
    this.tableData = [];
    this.setParams();
    this.getQueryPackage(this.finallyParams).subscribe(result => {
      this.loading = false;
      if (result.code === 200) {
        this.queryPackageFlag = true;
        this.tableData = result.result['list'];
        this.total = result.result['total'];
      }
    });
  }

  /**
   * 设置查询参数
   * @param params Object
   */
  setParams() {
    const params = {};
    for (const key in this.finallyParams) {
      if (this.finallyParams.hasOwnProperty(key)) {
        if ( this.finallyParams[key] !== null
        && this.finallyParams[key] !== undefined
        && this.finallyParams[key] !== '') {
          params[key] = this.finallyParams[key];
        }
      }
    }
    this.finallyParams = params;
  }


  /**
   * 新增查询包
   * @param url String 请求地址
   * @param params Object 请求参数
   */
  addQueryPackage(params = {}) {
    return this.requestHttp.post('dms/view/addQueryPackage', params);
  }

  /**
   * 获取查询包
   * @param url String 请求地址
   * @param params Object 请求参数
   */
  getQueryPackage(params = {}) {
    return this.requestHttp.post('dms/view/getQueryPackage', params);
  }


  /**
   * 修改查询包接口
   * @param url String 请求地址
   * @param params Object 请求参数
   */
  modQueryPackage(params = {}) {
    return this.requestHttp.post('dms/view/modQueryPackage', params);
  }

  /**
   * 删除查询包接口
   * @param url String 请求地址
   * @param params Object 请求参数
   */
  delQueryPackage(params = {}) {
    return this.requestHttp.post('dms/view/delQueryPackage', params);
  }
}
