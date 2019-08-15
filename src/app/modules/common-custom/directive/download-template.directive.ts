import { Directive, Input, HostListener } from '@angular/core';


@Directive({
  selector: '[appDownloadTemplate]'
})
export class DownloadTemplatDirective {
  @Input() appDownloadTemplate: string; // 必传 请求url
  constructor() { }
  @HostListener('click')
  exportExecl() {
    window.open(this.appDownloadTemplate);
  }
}
