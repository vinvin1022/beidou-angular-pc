import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingCenterComponent } from './components/setting-center/setting-center.component';
import { SetMetricsPermissionComponent } from './components/set-metrics-permission/set-metrics-permission.component';
import { AuthorityManagementComponent } from './components/authority-management/authority-management.component';
import { SetCustomColumnComponent } from './components/set-custom-column/set-custom-column.component';
import { SetIndexAuthorityComponent } from './components/set-index-authority/set-index-authority.component';
import { UserPermissionComponent } from './components/user-permission/user-permission.component';



export const SYSTEMROUTES: Routes = [
  { path: '', redirectTo: '/system/settingCenter', pathMatch: 'full' },

  {
    path: 'settingCenter', component: SettingCenterComponent,
    data: {
      name: '设置中心',
      breadcrumb: '设置中心'
    },
  },
  {
    path: 'setMetricsPermission', component: SetMetricsPermissionComponent,
    data: {
      name: '权限指标',
      breadcrumb: '权限指标'
    },
  },
  {
    path: 'authorityManagement', component: AuthorityManagementComponent,
    data: {
      name: '权限管理',
      breadcrumb: '权限管理'
    },
  },
  {
    path: 'authorityManagement/setCustomColumn', component: SetCustomColumnComponent,
    data: {
      name: '自定义列',
      breadcrumb: '自定义列'
    },
  },
  {
    path: 'authorityManagement/setIndexAuthority', component: SetIndexAuthorityComponent,
    data: {
      name: '指标权限',
      breadcrumb: '指标权限'
    },
  },
  {
    path: 'authorityManagement/userPermission', component: UserPermissionComponent,
    data: {
      name: '用户权限',
      breadcrumb: '用户权限'
    },
  }


];

@NgModule({
  imports: [RouterModule.forChild(SYSTEMROUTES)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
