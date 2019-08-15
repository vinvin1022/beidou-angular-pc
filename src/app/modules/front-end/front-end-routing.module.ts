import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetIndexComponent } from './components/net-index/net-index.component';
import { NetStatisticsComponent } from './components/net-statistics/net-statistics.component';
import { ElectricControlComponent } from './components/electric-control/electric-control.component';
import { ElectricStatisticsComponent } from './components/electric-statistics/electric-statistics.component';
import { ArmyDataAnalysisComponent } from './components/army-data-analysis/army-data-analysis.component';
import { ArmyFlowAnalysisComponent } from './components/army-flow-analysis/army-flow-analysis.component';
import { FrontEndRealTimeReportComponent } from './components/front-end-real-time-report/front-end-real-time-report.component';
import { IncubationProjectComponent } from './components/incubation-project/incubation-project.component';
import { EffectivenessComponent } from './components/effectiveness/effectiveness.component';
import { FlowTransactionPeriodicComponent } from './components/flow-transaction-periodic/flow-transaction-periodic.component';

const FRONTENDROUTERS: Routes = [
  { path: '', redirectTo: '/frontend/netIndex', pathMatch: 'full' },
  {
    path: 'netIndex', component: NetIndexComponent,
    data: {
      name: '网销效率指标统计',
      breadcrumb: '网销效率指标统计'
    }
  },
  {
    path: 'netStatistics', component: NetStatisticsComponent,
    data: {
      name: '网销项目指标统计',
      breadcrumb: '网销项目指标统计'
    }
  },
  {
    path: 'electricControl', component: ElectricControlComponent,
    data: {
      name: '电销效率指标统计',
      breadcrumb: '电销效率指标统计'
    }
  },
  {
    path: 'electricStatistics', component: ElectricStatisticsComponent,
    data: {
      name: '电销项目指标统计',
      breadcrumb: '电销项目指标统计'
    }
  },
  {
    path: 'armyDataAnalysis', component: ArmyDataAnalysisComponent,
    data: {
      name: '中端军团数据分析',
      breadcrumb: '中端军团数据分析'
    }
  },
  {
    path: 'armyFlowAnalysis', component: ArmyFlowAnalysisComponent,
    data: {
      name: '中端军团流量分析',
      breadcrumb: '中端军团流量分析'
    }
  },
  {
    path: 'frontEndRealTimeReport', component: FrontEndRealTimeReportComponent,
    data: {
      name: '实时监控',
      breadcrumb: '实时监控'
    }
  },
  {
    path: 'incubationProject', component: IncubationProjectComponent,
    data: {
      name: '孵化项目效率',
      breadcrumb: '孵化项目效率'
    }
  },
  {
    path: 'frontEndRealTimeReport/effectiveness', component: EffectivenessComponent,
    data: {
      name: '时效',
      breadcrumb: '时效'
    }
  },
  {
    path: 'flowTransactionPeriodic', component: FlowTransactionPeriodicComponent,
    data: {
      name: '流水成交周期表',
      breadcrumb: '流水成交周期表'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(FRONTENDROUTERS)],
  exports: [RouterModule]
})
export class FrontEndRoutingModule { }
