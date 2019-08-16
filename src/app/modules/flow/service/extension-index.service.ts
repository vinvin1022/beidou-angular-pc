import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable({
  providedIn: 'root'
})
export class ExtensionIndexService {
  public quotaObj = {
    a: { a: '指标' },
    b: { a: '总费比' },
    c: { a: '总流水' },
    d: { a: '7日内流水' },
    e: { a: '总名片数' },
    f: { a: '在线占比' },
    g: { a: '名片成本' },
    h: { a: '总销机' },
    i: { a: 'CPA' },
    j: { a: '总有效性' },
    k: { a: '在线有效性' },
    l: { a: '留言有效性' },
    m: { a: 'RPC' },
    n: { a: 'RPA' },
    o: { a: '总报名率' },
    p: { a: '总销转' },
    q: { a: '7日内销转' },
    r: { a: '在线销转' },
    s: { a: '留言销转' },
    t: { a: 'ARPU' },
    u: { a: '总报名数' },
    v: { a: '7日内报名数' },
    w: { a: '财务消费' },
    x: { a: '展现量' },
    y: { a: '点击数' },
    z: { a: 'CTR' },
    ab: { a: 'CPC' },
    ac: { a: '网电' }
  };

  constructor(private requestHttp: RequestService) { }
  /**
   * 流量推广指标
   * @param params object  请求参数
   */
  getExtensionTarget(params = {}) {
    return this.requestHttp.post('dms/view/extensionTarget', params);
  }

  /**
   * 推广总览导出
   * @param params object  请求参数
   */
  flowExportExportExtension(params = {}) {
    // return this.requestHttp.get('dms/flowExport/exportView', params);
    return this.requestHttp.exportExcel('dms/flowExport/exportExtension', params);
  }

}
