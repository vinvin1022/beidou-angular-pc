import {
  Component, OnInit, OnChanges, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CtrlUpermissionDialogService } from '../../../service/ctrl-upermission-dialog.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonSettargetService } from '../../../service/common-settarget.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';


@Component({
  selector: 'app-ctrl-upermission-dialog',
  templateUrl: './ctrl-upermission-dialog.component.html',
  styleUrls: ['./ctrl-upermission-dialog.component.scss'],
})
export class CtrlUpermissionDialogComponent implements OnInit, OnChanges, OnDestroy {
  isVisible = false;
  public validateForm: FormGroup;
  @Output() public sendNotify: EventEmitter<any> = new EventEmitter();
  public modulesOptions: Array<object> = [];
  public describeOptions: object = {};
  public saveParams: object = {};
  public rowData: object = {};
  public roleTypesOptions: Array<object> = [];
  public roleIdOptions: Array<object> = [];
  private ctrlObj = new Map([
    [1, { apiName: 'saveUserRole', msg: '新增' }],
    [2, { apiName: 'updateUserRole', msg: '修改' }]
  ]);
  public subscribeAll$ = {};
  public modeltitle = '新增';
  public subject = new Subject();
  private phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
  constructor(private ctrlUpermissionDalogService: CtrlUpermissionDialogService, private fb: FormBuilder, private message: NzMessageService,
    private commonSettargetService: CommonSettargetService, private commonCustomService: CommonCustomService) { }

  ngOnChanges() { }
  ngOnInit() {
    this.roleTypesOptions = this.commonSettargetService.roleTypesOptions;  // 初始化用户下拉选项
    this.initForm();
    this.accountNumberChange();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value) {
      if (!this.phoneReg.test(control.value)) {
        return { error: true };
      }
    }
    return {};
  }

  accountNumberChange() {
    this.subject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(phone => {
      if (this.phoneReg.test(phone + '')) {
        this.getUserByPhone(phone);
      }
    });
  }
  getUserByPhone(phone) {
    this.subscribeAll$[`getUserByPhone$`] = this.ctrlUpermissionDalogService.getUserByPhone({ phone: phone }).subscribe(res => {
      if (res.msg === '4001') {
        this.message.warning(res.result);
        this.validateForm.get('userName').patchValue(null);
        this.validateForm.get('userId').patchValue(null);
      } else {
        const { userId, userName } = res.result;
        this.validateForm.get('userName').patchValue(userName);
        this.validateForm.get('userId').patchValue(userId);
      }
    });
  }

  /**
  * 用户change
  * @param val
  */
  roleTypeChange(val?) {
    this.validateForm.get('resourceName').patchValue(null);
    this.validateForm.get('roleName').patchValue(null, { emitViewToModelChange: false });
    this.getKarakters(val);
  }

  getKarakters(roleType) {
    this.subscribeAll$[`getRoleByRoleType$`] = this.commonSettargetService.getRoleByRoleType({ roleType }).subscribe(res => {
      this.roleIdOptions = res.result;
    });
  }
  roleNameChange(val) {
    const selectedItem = this.roleIdOptions.find(item => val === item['roleName']);
    if (selectedItem) {
      this.validateForm.get('resourceName').patchValue(selectedItem['resourceName']);
      this.validateForm.get('roleId').patchValue(selectedItem['roleId']);
    }
  }

  initForm() {
    this.validateForm = this.fb.group({
      accountNumber: [{ value: null }, [Validators.required, this.phoneValidator]], // 账号
      userId: [{ value: null }, [Validators.required]], // 姓名
      userName: [{ value: null }, [Validators.required]], // 姓名
      roleType: [null, [Validators.required]], // 模块
      roleId: [null, [Validators.required]],
      roleName: [null, [Validators.required]], // 用户
      resourceName: [{ value: null }], // 用户描述
    });
  }
  showModal(rowData: object = {}): void {
    this.rowData = rowData;
    if (rowData['id']) {
      this.validateForm.get('accountNumber').setValidators(null);
      this.rowData['ctrlType'] = 2;
      this.modeltitle = `${this.ctrlObj.get(2).msg}用户`;
      this.validateForm.patchValue({
        userId: rowData['userId'],
        userName: rowData['userName'],
        roleType: rowData['roleType'],
        roleId: rowData['roleId'],
        roleName: rowData['roleName'],
        resourceName: rowData['resourceName']
      });
    } else {
      this.rowData['ctrlType'] = 1;
      this.modeltitle = `${this.ctrlObj.get(1).msg}用户`;
      this.validateForm.get('accountNumber').setValidators([Validators.required, this.phoneValidator]);
      this.validateForm.reset();
    }
    this.isVisible = true;
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
    if (this.rowData['id']) {
      this.saveParams['id'] = this.rowData['id'];
    }
    delete this.saveParams['resourceName'];
  }

  handleOk(): void {
    this.submitForm();
    if (this.validateForm.valid) {
      this.setSaveParams();
      const ctrlObj = this.ctrlObj.get(this.rowData['ctrlType']);
      this.subscribeAll$[`${ctrlObj.apiName}$`] = this.ctrlUpermissionDalogService[ctrlObj.apiName](this.saveParams).subscribe((res) => {
        if (res.code === 200) {
          this.message.success(`${ctrlObj.msg}成功`);
          this.isVisible = false;
          this.sendNotify.emit();
        } else {
          this.message.warning(`${res.msg}`);
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngOnDestroy(): void {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }

}
