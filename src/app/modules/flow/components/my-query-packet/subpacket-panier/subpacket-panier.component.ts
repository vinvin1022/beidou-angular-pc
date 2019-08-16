import { Component, OnInit, Inject, forwardRef, ViewEncapsulation, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { MyquerypacketService } from 'src/app/modules/flow/service/myquerypacket.service';
import { NewquerypackageDialogComponent } from '../newquerypackage-dialog/newquerypackage-dialog.component';

@Component({
  selector: 'app-subpacket-panier',
  templateUrl: './subpacket-panier.component.html',
  styleUrls: ['./subpacket-panier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubpacketPanierComponent implements OnInit {
  public condepartment = '';
  public typeIdValOptions: Array<object> = this.myquerypacketService.typeIdValOptions; // 类型下拉列表

  @Input() addBtnVal;
  public validateForm: FormGroup;
  @Output() sendQueryData = new EventEmitter<any>();
  @ViewChild('newquerypackageDialog', { static: false }) newquerypackageDialog: NewquerypackageDialogComponent;

  constructor(private fb: FormBuilder, private myquerypacketService: MyquerypacketService) { }


  submitForm($event): void {
    $event.preventDefault();
    this.makeMarkAsDirty();
    this.sendQueryData.emit(this.validateForm.value);

  }

  /**
   * 清除表格状态
   */
  makeMarkAsDirty() {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  /**
   * 重置数据
   * @param e MouseEvent
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.makeMarkAsDirty();
    // this.sendQueryData.emit(this.validateForm.value);
  }


  ngOnInit(): void {
    const { createUser, packageName, typeId } = this.myquerypacketService.defalutData;
    this.validateForm = this.fb.group({
      packageName: [packageName],
      createUser: [createUser],
      typeId: [typeId]
    });
  }

  goback() {
    history.go(-1);
  }

  /**
   * 打开新增查询包
   */
  showQuerypackageDialog() {
    this.newquerypackageDialog.handleCancel(true);
  }

  /**
   * 新增之后刷新表格
   */
  refreshTable(data) {
    this.validateForm.reset(this.myquerypacketService.defalutData);
    this.myquerypacketService.finallyParams['packageName'] = this.myquerypacketService.defalutData['packageName'];
    this.myquerypacketService.finallyParams['createUser'] = this.myquerypacketService.defalutData['createUser'];
    this.myquerypacketService.finallyParams['typeId'] = this.myquerypacketService.defalutData['typeId'];
    this.myquerypacketService.finallyParams['pageNo'] = this.myquerypacketService.defalutData['pageNo'];
    this.myquerypacketService.finallyParams['pageSize'] = this.myquerypacketService.defalutData['pageSize'];

    this.myquerypacketService._setTableData();
  }
}
