import { Directive, Input, HostListener, OnInit } from '@angular/core';
import { CommonCustomService } from '../service/common-custom.service';
import { RequestService } from 'src/app/service/request.service';


@Directive({
  selector: '[appExportExecl]'
})
export class ExportExeclDirective {
  @Input() getExportsParams: Function;  // 请求参数
  @Input() url: string; // 必传 请求url
  @Input() isGetCostomMenu: Boolean = true;
  constructor(private commonCustomService: CommonCustomService,
    private requestHttp: RequestService) { }
  @HostListener('click')
  exportExecl() {
    const parameters = { ...this.getExportsParams() };
    if (this.isGetCostomMenu) {
      this.commonCustomService.exportNetSaleTargetPost({ costomMenu: parameters['costomMenu'] }).subscribe(res => {
        if (parameters['costomMenu']) {
          delete parameters['costomMenu'];
        }
        const exportsParams = Object.assign({}, parameters, { costomMenuKey: res.result });
        this.requestHttp.exportExcel(this.url, exportsParams);
      });
    } else {
      delete parameters['costomMenu'];
      this.requestHttp.exportExcel(this.url, parameters);
    }
  }

}
