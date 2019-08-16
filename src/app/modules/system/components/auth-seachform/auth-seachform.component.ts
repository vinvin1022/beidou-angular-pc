import { Component, OnInit, DoCheck, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthSeachformService } from '../../service/auth-seachform.service';
import { CommonSettargetService } from '../../service/common-settarget.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';


@Component({
  selector: 'app-auth-seachform',
  templateUrl: './auth-seachform.component.html',
  styleUrls: ['./auth-seachform.component.scss']
})
export class AuthSeachformComponent implements OnInit, DoCheck, AfterViewInit {
  @Input() public isShowUserName = false;
  public loading = false;
  public validateForm: FormGroup;
  public roleTypesOptions: object;
  public roleIdOptions: any;
  public roleId = null;
  @Output() public sentSearchData = new EventEmitter<any>();
  constructor(private fb: FormBuilder, public authSeachformService: AuthSeachformService,
    private commonSettargetService: CommonSettargetService, private activatedRoute: ActivatedRoute, private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.roleTypesOptions = this.commonSettargetService.roleTypesOptions;  // 初始化角色下拉选项
  }

  ngDoCheck() {
    if (this.loading !== this.authSeachformService.loading) {
      this.loading = this.authSeachformService.loading;
    }
  }
  ngAfterViewInit() {
    const regUrl = this.router.url.indexOf('/system/authorityManagement/userPermission');
    if (regUrl >= 0) {
      this.setModules();
    }
  }

  setModules() {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      this.roleId = parseInt(queryParams.get('roleId'), 10);
      const roleType = parseInt(queryParams.get('roleType'), 10);
      if (roleType) {
        this.validateForm.get('roleType').patchValue(roleType, { emitViewToModelChange: false });
        this.validateForm.get('roleId').patchValue(this.roleId);
        this.getKarakters();
      }
      this.submitForm();
    });
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const paramsObject = {};
    for (const key in this.validateForm.value) {
      if (this.validateForm.value.hasOwnProperty(key)) {
        const element = this.validateForm.value[key];
        if (element) {
          if (this.isShowUserName && key === 'userName') {
            paramsObject[key] = element;
          } else {
            paramsObject[key] = element;
          }
        }
      }
    }
    // this.authSeachformService.sendMessage(paramsObject);
    this.sentSearchData.emit(paramsObject);
  }

  initForm() {
    const roleType = this.authSeachformService.defaultFormData['roleType'];
    const roleId = this.authSeachformService.defaultFormData['roleId'];
    const userName = this.authSeachformService.defaultFormData['userName'];
    this.validateForm = this.fb.group({
      roleType, // 角色类型
      roleId, // 角色名称
      userName // 用户名称
    });
  }



  /**
   * 角色change
   * @param val 参数
   */
  roleTypeChange(val?) {
    this.roleId = null;
    this.getKarakters();
  }

  getKarakters() {
    this.authSeachformService.getRoleByRoleType({ roleType: this.validateForm.get('roleType').value }).subscribe(res => {
      this.roleIdOptions = res.result;
      this.validateForm.get('roleId').patchValue(this.roleId);
    });
  }
}
