import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelfEmployedPerformanceComponent } from './components/self-employed-performance/self-employed-performance.component';
import { DailyHoursComponent } from './components/daily-hours/daily-hours.component';
import { RearendRealTimeReportComponent } from './components/rearend-real-timeReport/rearend-real-time-report.component';
import { PromotionPerformanceComponent } from './components/promotion-performance/promotion-performance.component';
import { DailyReachRateComponent } from './components/daily-reach-rate/daily-reach-rate.component';
import { WorkOrderReportComponent } from './components/work-order-report/work-order-report.component';
import { TasksDuringServiceComponent } from './components/tasks-during-service/tasks-during-service.component';



const REARENDROUTES: Routes = [
  { path: '', redirectTo: '/rearend/selfEmployedPerformance', pathMatch: 'full' },
  {
    path: 'selfEmployedPerformance', component: SelfEmployedPerformanceComponent,
    data: {
      name: '自营业绩',
      breadcrumb: '自营业绩'
    }
  },
  {
    path: 'dailyHours', component: DailyHoursComponent,
    data: {
      name: '每日通时',
      breadcrumb: '每日通时'
    }
  },
  {
    path: 'rearendRealTimeReport', component: RearendRealTimeReportComponent,
    data: {
      name: '实时监控',
      breadcrumb: '实时监控'
    }
  },
  {
    path: 'promotionPerformance', component: PromotionPerformanceComponent,
    data: {
      name: '升班业绩',
      breadcrumb: '升班业绩'
    }
  },

  {
    path: 'dailyReachRate', component: DailyReachRateComponent,
    data: {
      name: '每日触达率',
      breadcrumb: '每日触达率'
    }
  },
  {
    path: 'dailyWorkOrderReport', component: WorkOrderReportComponent,
    data: {
      name: '每日工单表',
      breadcrumb: '每日工单表'
    }
  },
  {
    path: 'tasksDuringService', component: TasksDuringServiceComponent,
    data: {
      name: '服务期任务统计表',
      breadcrumb: '服务期任务统计表'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(REARENDROUTES)],
  exports: [RouterModule]
})
export class RearEndRoutingModule { }
