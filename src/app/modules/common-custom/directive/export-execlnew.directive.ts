import { Directive, Input, HostListener, OnInit } from '@angular/core';
import { CommonCustomService } from '../service/common-custom.service';
import { RequestService } from 'src/app/service/request.service';


@Directive({
  selector: '[appExportExeclNew]'
})
export class ExportExeclNewDirective implements OnInit {
  @Input() serviceNameClass: object;  // 请求服务名
  @Input() getExportsParams: () => {};  // 请求参数
  @Input() foreordainMethond: string;  // 预先请求方法
  @Input() formalMethond: string;  // 正式请求方法

  constructor(private commonCustomService: CommonCustomService,
    private requestHttp: RequestService) { }

  ngOnInit(): void { }
  @HostListener('click')
  exportExecl() {
    const parameters = { ...this.getExportsParams() };
    if (this.foreordainMethond) {
      this.serviceNameClass[this.foreordainMethond](parameters).subscribe(res => {
        this.serviceNameClass[this.formalMethond]({ ridesKey: res.result });
      });
    } else {
      this.serviceNameClass[this.formalMethond](parameters);
    }
  }

}
