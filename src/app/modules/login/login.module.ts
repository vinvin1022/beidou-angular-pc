import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoginIndexComponent } from './components/index/index.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './sevice/login.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';



export const LOGINROUTES: Routes = [
  {
    path: '',
    component: LoginIndexComponent
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(LOGINROUTES),
    NgZorroAntdModule
  ],
  providers: [LoginService],
  exports: [LoginIndexComponent],
  declarations: [LoginIndexComponent]
})
export class LoginModule { }
