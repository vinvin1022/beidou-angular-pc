import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Code404Component } from './components/code404/code404.component';


import { LayoutComponent } from './components/layout/layout.component';
import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';

import { PersonAvatorComponent } from './components/person-avator/person-avator.component';

import { CommonCardComponent } from './components/common-card/common-card.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CustomColumnDialogComponent } from './components/custom-column-dialog/custom-column-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonCustomService } from './service/common-custom.service';
import { IsShowBtnDirective } from './directive/isshowbtn.directive';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { CustomColumnDialogService } from './service/custom-column-dialog.service';
import { BrowserMsgComponent } from './components/browser-msg/browser-msg.component';
import { ExportExeclDirective } from './directive/export-execl.directive';
import { SxSelectComponent } from './components/sx-select/sx-select.component';
import { BdBreadcrumbComponent } from './components/bd-breadcrumb/bd-breadcrumb.component';
import { DownloadTemplatDirective } from './directive/download-template.directive';
import { ExportExeclNewDirective } from './directive/export-execlnew.directive';
import { SxTableComponent } from './components/sx-table/sx-table.component';
import { EyeCardComponent } from './components/eye-card/eye-card.component';





@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgZorroAntdModule
  ],
  providers: [CommonCustomService, CustomColumnDialogService],
  exports: [NgZorroAntdModule, CommonModule,
    ReactiveFormsModule, SxSelectComponent, BdBreadcrumbComponent,
    FormsModule, Code404Component, IsShowBtnDirective, ExportExeclDirective, CommonCardComponent, DownloadTemplatDirective,
    CustomColumnDialogComponent, UploadFileComponent, BrowserMsgComponent, SxTableComponent, EyeCardComponent],
  declarations: [Code404Component, LayoutComponent, AsideMenuComponent, PersonAvatorComponent, IsShowBtnDirective, DownloadTemplatDirective,
    CommonCardComponent, CustomColumnDialogComponent, UploadFileComponent, BrowserMsgComponent, SxTableComponent,
    ExportExeclDirective, SxSelectComponent, BdBreadcrumbComponent, ExportExeclNewDirective, EyeCardComponent]
})
export class CommonCustomModule { }
