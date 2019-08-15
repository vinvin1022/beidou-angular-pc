import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LoginGuard } from '../guards/LoginGuard';
import { Code404Component } from '../modules/common-custom/components/code404/code404.component';
import { LayoutComponent } from '../modules/common-custom/components/layout/layout.component';
import { SelectivePreloadingStrategyService } from '../service/selective-preloading-strategy.service';
import { HomeIndexComponent } from '../modules/home/components/index/index.component';
import { GetMenuResolverService } from '../service/getMenuResolver.service';


export const routers: Routes = [
  {
    path: '', component: LayoutComponent,
    // resolve: {
    //   saveProId: GetMenuResolverService
    // },
    children: [
      {
        path: '', redirectTo: '/home', pathMatch: 'full'
      },
      {
        path: 'home', component: HomeIndexComponent, canActivate: [LoginGuard],
        data: {
          name: '首页',
          breadcrumb: '首页'
        }

      },
      {
        path: 'hometest', component: HomeIndexComponent, canActivate: [LoginGuard],
        data: {
          name: '首页测试',
          breadcrumb: '首页测试'
        }
      },
      {
        path: 'summaryperformance',
        loadChildren: '../modules/summary-performance/summary-performance.module#SummaryPerformanceModule',
        canActivate: [LoginGuard],
        data: {
          name: '总览',
          breadcrumb: '总览'
        }
      },
      {
        path: 'flow', loadChildren: '../modules/flow/flow.module#FlowModule', canActivate: [LoginGuard],
        data: {
          name: '流量',
          breadcrumb: '流量',
          preload: true
        }
      },
      {
        path: 'frontend', loadChildren: '../modules/front-end/front-end.module#FrontEndModule', canActivate: [LoginGuard],
        data: {
          name: '前端',
          breadcrumb: '前端',
          preload: true
        }
      },
      {
        path: 'middleend', loadChildren: '../modules/middle-end/middle-end.module#MiddleEndModule', canActivate: [LoginGuard],
        data: {
          name: '中端',
          breadcrumb: '中端'
        }
      },
      {
        path: 'rearend', loadChildren: '../modules/rear-end/rear-end.module#RearEndModule', canActivate: [LoginGuard],
        data: {
          name: '后端',
          breadcrumb: '后端'
        }
      },
      {
        path: 'system', loadChildren: '../modules/system/system.module#SystemModule', canActivate: [LoginGuard],
        data: {
          name: '系统',
          breadcrumb: '系统'
        }
      },
      {
        path: 'customservice', loadChildren: '../modules/customservice/customservice.module#CustomserviceModule', canActivate: [LoginGuard],
        data: {
          name: '客服&投诉',
          breadcrumb: '客服&投诉'
        }
      },
      {
        path: 'page404',
        component: Code404Component
      },
    ]
  },
  {
    path: 'login', loadChildren: '../modules/login/login.module#LoginModule',
  },
  { path: '**', component: Code404Component }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routers, { useHash: true, preloadingStrategy: SelectivePreloadingStrategyService })
  ],
  // providers: [SelectivePreloadingStrategyService],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
