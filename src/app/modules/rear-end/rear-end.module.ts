import { NgModule } from '@angular/core';
import { SelfEmployedPerformanceComponent } from './components/self-employed-performance/self-employed-performance.component';
import { DailyHoursComponent } from './components/daily-hours/daily-hours.component';
import { CommonCustomModule } from '../common-custom/common-custom.module';
import { SubdailyhoursTableComponent } from './components/daily-hours/subdailyhours-table/subdailyhours-table.component';
import { CommonrearFormComponent } from './components/commonrear-form/commonrear-form.component';
// tslint:disable-next-line:max-line-length
import { SubselfemployedTableComponent } from './components/self-employed-performance/subselfemployed-table/subselfemployed-table.component';

import { EmployedPerformanceService } from './service/employedPerformance.service';
import { DailyHoursService } from './service/dailyHours.service';
import { SetMeetStandardComponent } from './components/daily-hours/set-meet-standard/set-meet-standard.component';
import { RearEndRoutingModule } from './rear-end-routing.module';

import { SubrearendRealTableComponent } from './components/rearend-real-timeReport/subrearend-real-table/subrearend-real-table.component';
import { RearendRealTimeReportComponent } from './components/rearend-real-timeReport/rearend-real-time-report.component';
import { RearendRealTimeReportService } from './service/rearend-real-time-report.service';
import { SubpacketTableComponent } from '../flow/components/my-query-packet/subpacket-table/subpacket-table.component';
import { SubpromotionTableComponent } from './components/promotion-performance/subpromotion-table/subpromotion-table.component';
import { PromotionPerformanceComponent } from './components/promotion-performance/promotion-performance.component';
import { PromotionPerformanceService } from './service/promotionPerformance.service';
import { PromotionformService } from './service/promotion-form.service';
import { PromotionFormComponent } from './components/promotion-performance/promotion-form/promotion-form.component';
import { DailyReachRateComponent } from './components/daily-reach-rate/daily-reach-rate.component';
import { DailyReachRateService } from './service/daily-reach-rate.service';
import { ReachOrderTasksformService } from './service/reach-order-tasksform.service';
import { ReachOrderTasksFormComponent } from './components/reach-order-tasksform/reach-order-tasksform.component';
import { ReachRateTableComponent } from './components/daily-reach-rate/reach-rate-table/reach-rate-table.component';
import { WorkOrderReportComponent } from './components/work-order-report/work-order-report.component';

import { WorkOrderReportService } from './service/work-order-report.service';
import { TasksDuringServiceComponent } from './components/tasks-during-service/tasks-during-service.component';
import { TasksDuringServiceService } from './service/tasks-during-service.service';
import { AfterSalecategoryComponent } from './components/work-order-report/after-salecategory/after-salecategory.component';
import { AfterSalesubcategoryComponent } from './components/work-order-report/after-salesubcategory/after-salesubcategory.component';

@NgModule({
  imports: [
    // CommonModule,
    // NgZorroAntdModule,
    // ReactiveFormsModule,
    // FormsModule,
    // RouterModule.forChild(REARENDROUTES),
    RearEndRoutingModule,
    CommonCustomModule
  ],
  providers: [EmployedPerformanceService, DailyHoursService, RearendRealTimeReportService, PromotionPerformanceService, PromotionformService,
    DailyReachRateService, ReachOrderTasksformService, WorkOrderReportService, TasksDuringServiceService],
  declarations: [SelfEmployedPerformanceComponent, DailyHoursComponent, SubdailyhoursTableComponent, PromotionFormComponent,
    CommonrearFormComponent, SubselfemployedTableComponent, SetMeetStandardComponent, RearendRealTimeReportComponent, SubrearendRealTableComponent,
    SubpromotionTableComponent, PromotionPerformanceComponent, DailyReachRateComponent, ReachOrderTasksFormComponent, ReachRateTableComponent,
    WorkOrderReportComponent, TasksDuringServiceComponent, AfterSalecategoryComponent,
    AfterSalesubcategoryComponent]
})
export class RearEndModule { }
