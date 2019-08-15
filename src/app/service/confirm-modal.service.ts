import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  constructor(private modalService: NzModalService) { }
  private handleOk(): void { }

  private handleCancel(): void { }

  showConfirm(content = '请确认信息', handleOk = this.handleOk, handleCancel = this.handleCancel): void {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: content,
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: handleOk,
      nzOnCancel: handleCancel
    });
  }
}
