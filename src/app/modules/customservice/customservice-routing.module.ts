import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropoutMorningNewspaperComponent } from './components/dropout-morning-newspaper/dropout-morning-newspaper.component';
import { ComplaintsMonitoringComponent } from './components/complaints-monitoring/complaints-monitoring.component';
import { BusinessProcessingComponent } from './components/business-processing/business-processing.component';




const CUSTOMSERVICEROUTES: Routes = [
  { path: '', redirectTo: '/customservice/dropoutMorningNewspaper', pathMatch: 'full' },
  {
    path: 'dropoutMorningNewspaper', component: DropoutMorningNewspaperComponent,
    data: {
      name: '每日退学早报',
      breadcrumb: '每日退学早报'
    }
  },
  {
    path: 'complaintsMonitoring', component: ComplaintsMonitoringComponent,
    data: {
      name: '投诉监控日报',
      breadcrumb: '投诉监控日报'
    }
  },
  {
    path: 'businessProcessing', component: BusinessProcessingComponent,
    data: {
      name: '业务办理汇总表',
      breadcrumb: '业务办理汇总表'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(CUSTOMSERVICEROUTES)],
  exports: [RouterModule]
})
export class CustomserviceRoutingModule { }
