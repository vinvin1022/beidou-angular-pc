import { NgModule } from '@angular/core';




import { CustomserviceRoutingModule } from './customservice-routing.module';
import { CommonCustomModule } from '../common-custom/common-custom.module';
import { MorningNewspaperService } from './service/morning-newspaper.service';
import { DropoutComplaintProcessFormService } from './service/dropout-complaint-process-form.service';
import { DropoutComplaintProcessFormComponent } from './components/dropout-complaint-process-form/dropout-complaint-process-form.component';
import { NewspaperTableComponent } from './components/dropout-morning-newspaper/newspaper-table/newspaper-table.component';
import { DropoutMorningNewspaperComponent } from './components/dropout-morning-newspaper/dropout-morning-newspaper.component';
import { ComplaintsMonitoringComponent } from './components/complaints-monitoring/complaints-monitoring.component';
import { ComplaintsMonitoringTableComponent } from './components/complaints-monitoring/complaints-monitoring-table/complaints-monitoring-table.component';
import { ComplaintsMonitoringService } from './service/complaints-monitoring.service';
import { BusinessProcessingComponent } from './components/business-processing/business-processing.component';
import { ShowbusinessTableComponent } from './components/business-processing/showbusiness-table/showbusiness-table.component';
import { BusinessProcessingService } from './service/business-processing.service';


@NgModule({
  imports: [
    // CommonModule,
    // NgZorroAntdModule,
    // ReactiveFormsModule,
    // FormsModule,
    // RouterModule.forChild(REARENDROUTES),
    CustomserviceRoutingModule,
    CommonCustomModule
  ],
  providers: [MorningNewspaperService, DropoutComplaintProcessFormService, ComplaintsMonitoringService, BusinessProcessingService],
  declarations: [DropoutComplaintProcessFormComponent, NewspaperTableComponent, DropoutMorningNewspaperComponent, ComplaintsMonitoringComponent,
    ComplaintsMonitoringTableComponent, BusinessProcessingComponent, ShowbusinessTableComponent]
})
export class CustomserviceModule { }
