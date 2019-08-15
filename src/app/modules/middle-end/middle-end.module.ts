import { NgModule } from '@angular/core';
import { ArmyDataAnalysisComponent } from './components/army-data-analysis/army-data-analysis.component';
import { ArmyFlowAnalysisComponent } from './components/army-flow-analysis/army-flow-analysis.component';
import { CommonCustomModule } from '../common-custom/common-custom.module';
import { CommonsearchFormComponent } from './components/commonsearch-form/commonsearch-form.component';
import { SubarmydataTableComponent } from './components/army-data-analysis/subarmydata-table/subarmydata-table.component';
import { SubarmyflowTableComponent } from './components/army-flow-analysis/subarmy-flow-table/subarmy-flow-table.component';
import { MiddleEndSearchFormService } from './service/middleEndSearchForm.service';
import { ArmyDataAnalysisService } from './service/armyDataAnalysis.service';
import { MiddleEndRoutingModule } from './middle-end-routing.module';



@NgModule({
  imports: [
    // CommonModule,
    // NgZorroAntdModule,
    // ReactiveFormsModule,
    // RouterModule.forChild(MIDDLEENDROUTES),
    CommonCustomModule,
    MiddleEndRoutingModule
  ],
  providers: [MiddleEndSearchFormService, ArmyDataAnalysisService],
  declarations: [ArmyDataAnalysisComponent, ArmyFlowAnalysisComponent, CommonsearchFormComponent,
  SubarmydataTableComponent, SubarmyflowTableComponent]
})
export class MiddleEndModule { }

