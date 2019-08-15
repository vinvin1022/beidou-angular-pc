import {
  Component, OnInit, OnChanges, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { OperateRoleDialogService } from '../../../service/operate-role-dialog.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-operate-role-dialog',
  templateUrl: './operate-role-dialog.component.html',
  styleUrls: ['./operate-role-dialog.component.scss'],
})
export class OperateRoleDialogComponent implements OnInit, OnChanges, OnDestroy {
  isVisible = false;
  public validateForm: FormGroup;
  @Output() public sendNotify: EventEmitter<any> = new EventEmitter();
  public permissionDescriptions: Map<object, Array<object>>;
  public modulesOptions: Array<object> = [];
  public describeOptions: object = {};
  public saveParams: object = {};
  public rowData: object = {};
  private ctrlObj = new Map([
    [1, { apiName: 'saveRole', msg: '新增' }],
    [2, { apiName: 'updateRole', msg: '修改' }]
  ]);
  public modeltitle = '新增';
  constructor(private operateRoleDalogService: OperateRoleDialogService, private fb: FormBuilder, private message: NzMessageService) { }
  ngOnChanges() { }
  ngOnInit() {
    this.initForm();
    this.setOptions();
  }
  setOptions(): void {
    this.permissionDescriptions = this.operateRoleDalogService.permissionDescriptions;
    for (const iterator of this.permissionDescriptions) {
      this.modulesOptions.push(iterator[0]);
      this.describeOptions[iterator[0]['optionId']] = iterator[1];
    }
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  roleTypeChange(roleType) {
    this.validateForm.get('resourceId').patchValue(null, { emitViewToModelChange: false });
  }
  roleNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value && control.value.length > 20) {
      return { length: true };
    }
    return {};
  }

  initForm() {
    this.validateForm = this.fb.group({
      roleType: [null, [Validators.required]], // 模块
      roleName: [null, [Validators.required, this.roleNameValidator]], // 角色名称
      resourceId: [null, [Validators.required]], // 描述名称id
      resourceName: [null], // 描述名称
    });
  }
  showModal(rowData: object = {}): void {
    this.rowData = rowData;
    this.rowData['ctrlType'] = 1;
    this.modeltitle = `${this.ctrlObj.get(1).msg}角色`;
    if (rowData['roleId']) {
      this.rowData['ctrlType'] = 2;
      this.modeltitle = `${this.ctrlObj.get(2).msg}角色`;
      this.validateForm.patchValue({
        roleType: rowData['roleType'],
        roleName: rowData['roleName'],
        resourceId: parseInt(rowData['resourceId'], 10),
        resourceName: rowData['resourceName']
      });

    } else {
      this.validateForm.reset();
    }
    this.isVisible = true;
  }

  resourceIdChange(resourceId) {
    if (this.validateForm.get('roleType').value) {
      for (const iterator of this.describeOptions[this.validateForm.get('roleType').value]) {
        if (iterator.optionId === resourceId) {
          this.validateForm.get('resourceName').patchValue(iterator.optionName);
        }
      }
    }

  }

  setSaveParams() {
    for (const key in this.validateForm.value) {
      if (this.validateForm.value.hasOwnProperty(key)) {
        const value = this.validateForm.value[key];
        if (value) {
          this.saveParams[key] = value;
        }
      }
    }
    if (this.rowData['roleId']) {
      this.saveParams['roleId'] = this.rowData['roleId'];
    }
  }

  handleOk(): void {
    this.submitForm();
    if (this.validateForm.valid) {
      this.setSaveParams();
      const ctrlObj = this.ctrlObj.get(this.rowData['ctrlType']);
      this.operateRoleDalogService[ctrlObj.apiName](this.saveParams).subscribe((res) => {
        if (res.code === 200) {
          this.message.success(`${ctrlObj.msg}成功`);
          this.isVisible = false;
          this.sendNotify.emit();
        } else if (res.code === 90041201) {
          this.message.warning(`${res.msg}`);
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngOnDestroy(): void {

  }

}
