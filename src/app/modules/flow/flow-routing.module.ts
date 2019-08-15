import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenqueryPacketComponent } from './components/general-introduction/genquery-packet/genquery-packet.component';
import { ExtQueryPacketComponent } from './components/extension-index/extquery-packet/extquery-packet.component';
import { SalesQueryPacketComponent } from './components/sales-target/salesquery-packet/salesquery-packet.component';
import { ReleaseQueryPacketComponent } from './components/release-monitoring/releasequery-packet/releasequery-packet.component';
import { GeneralIntroductionComponent } from './components/general-introduction/general-introduction.component';
import { LoginGuard } from 'src/app/guards/LoginGuard';
import { GeneralIntroductionAComponent } from './components/general-introductionA/general-introductionA.component';
import { ExtensionIndexComponent } from './components/extension-index/extension-index.component';
import { SalesTargetComponent } from './components/sales-target/sales-target.component';
import { ReleaseMonitoringComponent } from './components/release-monitoring/release-monitoring.component';
import { OnlineStatisticsComponent } from './components/online-statistics/online-statistics.component';
import { ExpansionDerivationComponent } from './components/expansion-derivation/expansion-derivation.component';
import { TrafficRealTimeReportComponent } from './components/traffic-real-time-report/traffic-real-time-report.component';


const FLOWROUTES: Routes = [
  { path: '', redirectTo: '/flow/generalIntroductionA', pathMatch: 'full' },
  {
    path: 'generalIntroduction/genQueryPacket', component: GenqueryPacketComponent, data: {
      breadcrumb: '查询包管理',
      authority: {
        add: 'b030703',
        edit: 'b030704',
        del: 'b030705'
      }
    }
  },
  {
    path: 'generalIntroductionA/genQueryPacketA', component: GenqueryPacketComponent, data: {
      breadcrumb: '查询包管理',
      authority: {
        add: 'b030103',
        edit: 'b030105',
        del: 'b030104'
      }
    }
  },
  {
    path: 'extensionIndex/extQueryPacket', component: ExtQueryPacketComponent, data: {
      breadcrumb: '查询包管理',
      authority: {
        add: 'b030203',
        edit: 'b030204',
        del: 'b030205'
      }
    }
  },
  {
    path: 'salesTarget/salesQueryPacket', component: SalesQueryPacketComponent, data: {
      breadcrumb: '查询包管理',
      authority: {
        add: 'b030303',
        edit: 'b030304',
        del: 'b030305'
      }
    }
  },
  {
    path: 'releaseMonitoring/releaseQueryPacket', component: ReleaseQueryPacketComponent, data: {
      breadcrumb: '查询包管理',
      authority: {
        add: 'b030403',
        edit: 'b030404',
        del: 'b030405'
      }
    }
  },

  { // 推广总览(弃用)
    path: 'generalIntroduction', component: GeneralIntroductionComponent, canActivate: [LoginGuard],
    data: {
      name: '推广总览',
      breadcrumb: '推广总览'
    },
  },

  { // 推广总览
    path: 'generalIntroductionA', component: GeneralIntroductionAComponent, canActivate: [LoginGuard],
    data: {
      name: '推广总览',
      breadcrumb: '推广总览',
      keep: true
    },
  },
  { // 推广指标
    path: 'extensionIndex', component: ExtensionIndexComponent,
    data: {
      name: '推广指标',
      breadcrumb: '推广指标'
    }
  },
  { // 销售指标
    path: 'salesTarget', component: SalesTargetComponent,
    data: {
      name: '销售指标',
      breadcrumb: '销售指标'
    }
  },
  { // 投放监控
    path: 'releaseMonitoring', component: ReleaseMonitoringComponent,
    data: {
      name: '投放监控',
      breadcrumb: '投放监控'
    }
  },
  { // 在线统计
    path: 'onlineStatistics', component: OnlineStatisticsComponent,
    data: {
      name: '在线统计',
      breadcrumb: '在线统计'
    }
  },
  { // 渠道展点消
    path: 'expansionDerivation', component: ExpansionDerivationComponent,
    data: {
      name: '渠道展点消',
      breadcrumb: '渠道展点消'
    }
  },
  { // 实时监控
    path: 'trafficRealTimeReport', component: TrafficRealTimeReportComponent,
    data: {
      name: '实时监控',
      breadcrumb: '实时监控'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(FLOWROUTES)],
  exports: [RouterModule]
})
export class FlowRoutingModule { }
