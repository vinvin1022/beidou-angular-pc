import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { LoginService } from '../../sevice/login.service';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { LandingAuthorityService } from 'src/app/service/landing-authority.service';
import { AppRoutingCache } from 'src/app/routes/app-routing-cache';


@Component({
  selector: 'app-login-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class LoginIndexComponent implements OnInit {
  public loading: Boolean = false;
  validateForm: FormGroup;
  public buttonList: Array<any> = [];
  public paths: Array<any> = [];


  constructor(private fb: FormBuilder,
    private nzMessage: NzMessageService, private loginService: LoginService, private landingAuthorityService: LandingAuthorityService) {
  }

  ngOnInit(): void {
    AppRoutingCache.handlers = {};
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    this.loading = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.value.userName && this.validateForm.value.password) {
      this.loginService.login(this.validateForm.value.userName, this.validateForm.value.password).subscribe(res => {
        if (res.code !== 200) {
          this.nzMessage.error(res.text);
        } else {
          sessionStorage.setItem('token', res.data.token);
          this.getNavBd();
          this.queryUserInfo();
        }
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }


  /**
   * 获取导航菜单
   */
  queryUserInfo() {
    this.loginService.queryUserInfo().subscribe(res => {
      sessionStorage.setItem('userInfo', res.data && JSON.stringify(res.data));
    });
  }

  /**
   * 获取导航菜单
   */
  getNavBd() {
    this.loginService.getNavBd().subscribe(result => {
      sessionStorage.setItem('menu', JSON.stringify(result.data));
      this.settingButtonPermissions(result.data);
      sessionStorage.setItem('buttonList', JSON.stringify(this.buttonList));
      this.landingAuthorityService.toDefaultPage();
    });
  }



  settingButtonPermissions(obj) {
    if (obj && Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (item.children && Array.isArray(item.children)) {
          this.settingButtonPermissions(item.children);
        } else if (!item.children && !item.menuUrl) {
          this.buttonList.push(item);
        }
      });
    }
  }
}
