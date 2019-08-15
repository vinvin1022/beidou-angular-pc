import { NgModule } from '@angular/core';
import { SummaryPerformanceComponent } from './components/pandect/summary-performance/summary-performance.component';
import { CommonCustomModule } from '../common-custom/common-custom.module';
import { IndexOverviewComponent } from './components/pandect/index-overview/index-overview.component';

import { SummaryPerformanceRoutingModule } from './summary-performance-routing.module';
import { TimeReportTableComponent } from './components/time-war-report/time-report-table.component';
import { TimeWarReportService } from './service/time-war-report.service';
import { PandectComponent } from './components/pandect/pandect.component';

import { SituationBusinessTableComponent } from './components/situation-of-business/situation-business-table/situation-business-table.component';
import { SituationOfBusinessComponent } from './components/situation-of-business/situation-of-business.component';
import { SituationBusinessFormComponent } from './components/situation-of-business/situation-business-form/situation-business-form.component';
import { SituationBusinessFormService } from './service/situation-business-form.service';
import { SituationOfBusinessService } from './service/situation-of-business.service';
import { RealTimeChartComponent } from './components/situation-of-business/real-time-chart/real-time-chart.component';
import { HomeModule } from '../home/home.module';


@NgModule({
  imports: [
    CommonCustomModule,
    SummaryPerformanceRoutingModule,
    HomeModule
  ],
  providers: [TimeWarReportService, SituationBusinessFormService, SituationOfBusinessService],
  declarations: [SummaryPerformanceComponent, IndexOverviewComponent, PandectComponent, TimeReportTableComponent,
    SituationOfBusinessComponent, SituationBusinessTableComponent, SituationBusinessFormComponent, RealTimeChartComponent]
})
export class SummaryPerformanceModule { }
