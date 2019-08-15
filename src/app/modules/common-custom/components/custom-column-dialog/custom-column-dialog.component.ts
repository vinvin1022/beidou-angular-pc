import {
  Component, OnInit, ViewEncapsulation, Input, OnChanges, Output, EventEmitter, ViewChild, TemplateRef,
  OnDestroy
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { LessformService } from 'src/app/modules/front-end/service/lessform.service';
import { CustomColumnDialogService } from '../../service/custom-column-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SetMetricsPermissionService } from 'src/app/modules/system/service/set-metrics-permission.service';

@Component({
  selector: 'app-custom-column-dialog',
  templateUrl: './custom-column-dialog.component.html',
  styleUrls: ['./custom-column-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomColumnDialogComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;
  @ViewChild('tplTitle', { static: false }) tplTitle: TemplateRef<any>;
  @ViewChild('tplFooter', { static: false }) tplFooter: TemplateRef<any>;
  @Input() title = '自定义显示列';
  public customColumn = {};
  @Output() setFilterField = new EventEmitter();
  public okdisabled = false;
  public keysArray: Array<string> = [];
  public saveMenuMsgParams: object = {};
  public type: string;
  public dialogModel;
  constructor(private modalService: NzModalService, private activatedRoute: ActivatedRoute,
    private customColumnDialogService: CustomColumnDialogService, private setMetricsPermissionService: SetMetricsPermissionService) { }

  ngOnChanges() { }
  ngOnInit() { }
  setSaveMenuMsgParams() {
    let { path } = this.activatedRoute.routeConfig;
    if (path === 'electricControl') {
      if (this.type === '1') {
        // path = 'electricControlday';
        path = this.setMetricsPermissionService.reportMenus['5'][0]['value'];
      } else if (this.type === '2') {
        // path = 'electricControlmonth';
        path = this.setMetricsPermissionService.reportMenus['5'][1]['value'];
      }
    }
    this.saveMenuMsgParams['menuId'] = path;
    if (typeof this.saveMenuMsgParams['customMenu'] === 'string') {
      this.saveMenuMsgParams['customMenu'] = JSON.parse(this.saveMenuMsgParams['customMenu']);
    }
    const customMenu = this.saveMenuMsgParams['customMenu'];
    // const selectedLie = this.getSelectedLie();
    const selectedLie = this.customColumn;
    if (customMenu) {
      customMenu[this.type] = selectedLie;
      this.saveMenuMsgParams['customMenu'] = JSON.stringify(customMenu);
    }
  }

  getSelectedLie() {
    const tmpObj = {};
    for (const pkey in this.customColumn) {
      if (this.customColumn.hasOwnProperty(pkey)) {
        const pelement = this.customColumn[pkey];
        tmpObj[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              tmpObj[pkey][mkey] = melement;
            } else {
              const tmpArr = [];
              melement.forEach(item => {
                if (item['checked']) {
                  tmpArr.push({ ...item });
                }
              });
              tmpObj[pkey][mkey] = tmpArr;
            }
          }
        }
      }
    }
    return tmpObj;
  }

  handleOk(customColumnData: object): void {
    this.customColumn = customColumnData;
    // this.customColumnDialogService.columnData = this.customColumn;
    this.setSaveMenuMsgParams();
    this.customColumnDialogService.saveMenu(this.saveMenuMsgParams).subscribe(res => {
      if (res.code === 200) {
        this.customColumnDialogService.columnData = this.customColumn;
        this.setFilterField.emit(this.customColumn);
        this.destroyDialogModel();
      }
    });
  }

  showDialog(customMenu?: object, type?: string) {
    this.saveMenuMsgParams['customMenu'] = customMenu;
    this.type = type;
    // this.customColumn = this.customColumnDialogService.resetColumnData(customColumnData);
    this.customColumn = this.customColumnDialogService.resetColumnData(this.customColumnDialogService.columnData);

    this.keysArray = Object.keys(this.customColumn);
    this.dialogModel = this.modalService.create({
      nzClassName: 'custom-column-dialog',
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '750px',
      // nzOnOk: () => { this.handleOk(customColumnData); },
      // nzOnCancel: () => { this.destroyDialogModel(); }
    });
  }

  goSetIndexAuthority(e) {
    this.destroyDialogModel();
  }

  destroyDialogModel() {
    if (this.dialogModel) {
      this.dialogModel.destroy();
    }
  }

  okTplModal() {
    this.handleOk(this.customColumn);
  }



  updateAllChecked(typeName): void {
    this.customColumn[typeName].indeterminate = false;
    if (this.customColumn[typeName].allChecked) {
      this.customColumn[typeName].children.forEach(item => item.checked = true);
    } else {
      this.customColumn[typeName].children.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked(typeName): void {
    if (this.customColumn[typeName].children.every(item => item.checked === false)) {
      this.customColumn[typeName].allChecked = false;
      this.customColumn[typeName].indeterminate = false;
    } else if (this.customColumn[typeName].children.every(item => item.checked === true)) {
      this.customColumn[typeName].allChecked = true;
      this.customColumn[typeName].indeterminate = false;
    } else {
      this.customColumn[typeName].allChecked = false;
      this.customColumn[typeName].indeterminate = true;
    }
  }

  ngOnDestroy() {
    this.customColumnDialogService.columnData = null;
    if (this.dialogModel) {
      this.dialogModel.destroy();
    }
  }

}
