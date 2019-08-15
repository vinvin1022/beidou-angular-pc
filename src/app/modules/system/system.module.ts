import { NgModule } from '@angular/core';
import { SettingCenterComponent } from './components/setting-center/setting-center.component';
import { CommonCustomModule } from '../common-custom/common-custom.module';
import { SetMetricsPermissionComponent } from './components/set-metrics-permission/set-metrics-permission.component';
import { OptionalFieldComponent } from './components/optional-field/optional-field.component';
import { SystemRoutingModule } from './system-routing.module';
import { AuthorityManagementComponent } from './components/authority-management/authority-management.component';
import { AuthSeachformService } from './service/auth-seachform.service';
import { AuthmanTableService } from './service/authman-table.service';
import { AuthmanTableComponent } from './components/authority-management/authman-table/authman-table.component';
import { OperateRoleDialogService } from './service/operate-role-dialog.service';
import { OperateRoleDialogComponent } from './components/authority-management/operate-role-dialog/operate-role-dialog.component';
import { AuthSeachformComponent } from './components/auth-seachform/auth-seachform.component';
import { SetCustomColumnComponent } from './components/set-custom-column/set-custom-column.component';
import { SetIndexAuthorityComponent } from './components/set-index-authority/set-index-authority.component';
import { CommonSettargetComponent } from './components/common-settarget/common-settarget.component';
import { CommonSettargetService } from './service/common-settarget.service';
import { AuthorityOptionalFieldComponent } from './components/authority-optional-field/authority-optional-field.component';
import { CtrlUpermissionDialogService } from './service/ctrl-upermission-dialog.service';
import { UserPermissionComponent } from './components/user-permission/user-permission.component';
import { UserPermissionTableComponent } from './components/user-permission/user-permission-table/user-permission-table.component';
import { CtrlUpermissionDialogComponent } from './components/user-permission/ctrl-upermission-dialog/ctrl-upermission-dialog.component';
import { UserPermissionTableService } from './service/user-permission-table.service';
import { TreeComponent } from './components/user-permission/tree/tree.component';






@NgModule({
  imports: [
    SystemRoutingModule,
    CommonCustomModule
  ],
  providers: [AuthSeachformService, AuthmanTableService, OperateRoleDialogService, CommonSettargetService, CtrlUpermissionDialogService,
    UserPermissionTableService],
  declarations: [SettingCenterComponent, SetMetricsPermissionComponent, OptionalFieldComponent, AuthorityManagementComponent, AuthSeachformComponent,
    AuthmanTableComponent, OperateRoleDialogComponent, SetCustomColumnComponent, SetIndexAuthorityComponent, CommonSettargetComponent,
    AuthorityOptionalFieldComponent, UserPermissionComponent, UserPermissionTableComponent, CtrlUpermissionDialogComponent, TreeComponent
  ]
})


export class SystemModule { }
