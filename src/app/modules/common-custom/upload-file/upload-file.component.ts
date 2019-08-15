import { Component, OnInit, Input } from '@angular/core';
import { HttpRequest, HttpEvent, HttpEventType, HttpClient, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  public fileList: Array<any> = [];
  public uploadType: String = 'upload';
  @Input() public bdShowUploadList: Boolean | { showPreviewIcon?: boolean, showRemoveIcon?: boolean } = false;  // 是否显示上传文件列表
  @Input() public bduploadFileUrl: String = 'dms/xiaoNeng/import/xiaoNengImport';  // 请求url
  @Input() public bdSize: Number = 0;    // 限制文件大小q
  @Input() public bdName: String = 'exclFile';  // 文件流参数
  @Input() public bdBtnTxt: String = '导入';    // 按钮文本

  constructor(private http: HttpClient, private message: NzMessageService) { }

  ngOnInit() { }

  uploadFileChange(file) {
    switch (file.type) {
      case 'success':
        const { code, msg, result } = file.file.response;
        if (code === -1) {
          this.message.error(msg);
        } else {
          this.message.success(result + '数据！');
        }
        this.uploadType = 'upload';
        break;
      case 'progress':
        this.uploadType = 'loading';
        break;
      case 'error':
        this.uploadType = 'upload';
        break;
      default:
        break;
    }
  }


  customUploadFile = (item: UploadXHRArgs) => {
    const req = this._setParams(item);
    // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
    return this.http.request(req).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) {
          // tslint:disable-next-line:no-any
          (event as any).percent = event.loaded / event.total! * 100;
        }
        // 处理上传进度条，必须指定 `percent` 属性来表示进度
        item.onProgress!(event, item.file!);
      } else if (event instanceof HttpResponse) {
        // 处理成功
        item.onSuccess!(event.body, item.file!, event);
      }
    }, (err) => {
      // 处理失败
      item.onError!(err, item.file!);
    });
  }

  private _setParams(item) {
    // 构建一个 FormData 对象，用于存储文件或其他参数
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append(this.bdName as string, item['file'] as any);
    const req = new HttpRequest('POST', item['action'], formData, {
      reportProgress: true,
      withCredentials: true
    });
    return req;
  }

}
