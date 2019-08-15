import { NgModule } from '@angular/core';

import { NetIndexComponent } from './components/net-index/net-index.component';
import { NetStatisticsComponent } from './components/net-statistics/net-statistics.component';

import { CommonCustomModule } from '../common-custom/common-custom.module';
import { ElectricControlComponent } from './components/electric-control/electric-control.component';
import { ElectricStatisticsComponent } from './components/electric-statistics/electric-statistics.component';
import { CommonlessFormComponent } from './components/commonless-form/commonless-form.component';

import { SubidxntTableComponent } from './components/net-index/subidxnt-table/subidxnt-table.component';
import { LessformService } from './service/lessform.service';
import { MoreformService } from './service/moreform.service';

import { SubelectricTableComponent } from './components/electric-control/subelectric-table/subelectric-table.component';
import { CommonmoreFormComponent } from './components/commonmore-form/commonmore-form.component';
import { SubstatisticsTableComponent } from './components/net-statistics/substatistics-table/substatistics-table.component';
import { SubelectricstatTableComponent } from './components/electric-statistics/subelectricstat-table/subelectricstat-table.component';
import { NetindexService } from './service/netindex.service';
import { NetstatisticsService } from './service/netstatistics.service';
import { ElectricControlService } from './service/electriccontrol.service';
import { ElectricstatisticsService } from './service/electricstatistics.service';
import { ExDetailListComponent } from './components/electric-control/detailList/exdetailList.component';
import { ElstatDetailListComponent } from './components/electric-statistics/elstatdetailList/elstatdetailList.component';
import { IndexDetailListComponent } from './components/net-index/indexDetailList/indexDetailList.component';
import { NetstatDetailListComponent } from './components/net-statistics/netstatdetailList/netstatdetailList.component';
import { ArmyFlowAnalysisComponent } from './components/army-flow-analysis/army-flow-analysis.component';
import { ArmyDataAnalysisComponent } from './components/army-data-analysis/army-data-analysis.component';
import { MiddleEndSearchFormService } from './service/middleEndSearchForm.service';
import { ArmyDataAnalysisService } from './service/armyDataAnalysis.service';
import { CommonsearchFormComponent } from './components/commonsearch-form/commonsearch-form.component';
import { SubarmydataTableComponent } from './components/army-data-analysis/subarmydata-table/subarmydata-table.component';
import { SubarmyflowTableComponent } from './components/army-flow-analysis/subarmy-flow-table/subarmy-flow-table.component';
import { FrontEndRoutingModule } from './front-end-routing.module';
import { SubrealTimeTableComponent } from './components/front-end-real-time-report/subreal-time-table/subreal-time-table.component';
import { FrontEndRealTimeReportComponent } from './components/front-end-real-time-report/front-end-real-time-report.component';
import { FrontRealFormComponent } from './components/front-real-form/front-real-form.component';
import { FrontRealFormService } from './service/front-real-form.service';
import { FrontRealReportService } from './service/front-real-report.service';
import { IncubationProjectService } from './service/incubation-project.service';
import { IncubationProjectComponent } from './components/incubation-project/incubation-project.component';
import { SubprojectableComponent } from './components/incubation-project/subproject-table/subproject-table.component';
import { EffectivenessComponent } from './components/effectiveness/effectiveness.component';
import { SubeffectiveTableComponent } from './components/effectiveness/subeffective-table/subeffective-table.component';
import { EffectivenessService } from './service/effectiveness.service';
import { TransactionPeriodicTableComponent } from './components/flow-transaction-periodic/transaction-periodic-table/transaction-periodic-table.component';
import { TransactionPeriodicService } from './service/transaction-periodic.service';
import { FlowTransactionPeriodicComponent } from './components/flow-transaction-periodic/flow-transaction-periodic.component';


@NgModule({
  imports: [
    FrontEndRoutingModule,
    CommonCustomModule
  ],
  providers: [LessformService, MoreformService, NetindexService, NetstatisticsService, ElectricControlService, ElectricstatisticsService,
    MiddleEndSearchFormService, ArmyDataAnalysisService, FrontRealFormService, FrontRealReportService, IncubationProjectService, TransactionPeriodicService,
    EffectivenessService],
  declarations: [NetIndexComponent, NetStatisticsComponent, ElectricControlComponent, ElectricStatisticsComponent, CommonlessFormComponent,
    SubidxntTableComponent, SubelectricTableComponent, SubstatisticsTableComponent, SubelectricstatTableComponent,
    CommonmoreFormComponent, ExDetailListComponent, ElstatDetailListComponent, IndexDetailListComponent, NetstatDetailListComponent,
    ArmyFlowAnalysisComponent, ArmyDataAnalysisComponent, CommonsearchFormComponent, SubarmydataTableComponent, SubarmyflowTableComponent,
    SubrealTimeTableComponent, FrontEndRealTimeReportComponent, FrontRealFormComponent, IncubationProjectComponent, SubprojectableComponent,
    EffectivenessComponent, SubeffectiveTableComponent, FlowTransactionPeriodicComponent, TransactionPeriodicTableComponent
  ]
})
export class FrontEndModule { }
