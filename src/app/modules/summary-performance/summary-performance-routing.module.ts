import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeReportTableComponent } from './components/time-war-report/time-report-table.component';
import { PandectComponent } from './components/pandect/pandect.component';
import { SituationOfBusinessComponent } from './components/situation-of-business/situation-of-business.component';



const MIDDLEENDROUTES: Routes = [
  { path: '', redirectTo: '/summaryperformance/goodresults', pathMatch: 'full' },
  {
    path: 'goodresults', component: PandectComponent,
    data: {
      name: '业绩总览',
      breadcrumb: '业绩总览'
    }
  }, {
    path: 'timeWarReport', component: TimeReportTableComponent,
    data: {
      name: '实时战报',
      breadcrumb: '实时战报'
    }
  }, {
    path: 'situationOfBusiness', component: SituationOfBusinessComponent,
    data: {
      name: '名片实时概况',
      breadcrumb: '名片实时概况'
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(MIDDLEENDROUTES)],
  exports: [RouterModule]
})
export class SummaryPerformanceRoutingModule { }
