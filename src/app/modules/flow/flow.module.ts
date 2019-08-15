import { NgModule } from '@angular/core';

import { CommonCustomModule } from '../common-custom/common-custom.module';

import { GeneralIntroductionComponent } from './components/general-introduction/general-introduction.component';
import { ExtensionIndexComponent } from './components/extension-index/extension-index.component';
import { SalesTargetComponent } from './components/sales-target/sales-target.component';
import { ReleaseMonitoringComponent } from './components/release-monitoring/release-monitoring.component';
import { OnlineStatisticsComponent } from './components/online-statistics/online-statistics.component';

import { SubonlineTableComponent } from './components/online-statistics/subonline-table/subonline-table.component';
import { SubonlineParationComponent } from './components/online-statistics/subonline-paration/subonline-paration.component';


import { SubgeneralTableComponent } from './components/general-introduction/subgeneral-table/subgeneral-table.component';

import { CommonFormComponent } from './components/common-form/common-form.component';
import { SubextensionTableComponent } from './components/extension-index/subextension-table/subextension-table.component';

import { FlowcommonformService } from './service/flowcommonform.service';
import { SubsalesTableComponent } from './components/sales-target/subsales-table/subsales-table.component';
import { SubreleaseTableComponent } from './components/release-monitoring/subrelease-table/subrelease-table.component';
import { MyQueryPacketComponent } from './components/my-query-packet/my-query-packet.component';
import { GenqueryPacketComponent } from './components/general-introduction/genquery-packet/genquery-packet.component';
import { ExtQueryPacketComponent } from './components/extension-index/extquery-packet/extquery-packet.component';
import { SalesQueryPacketComponent } from './components/sales-target/salesquery-packet/salesquery-packet.component';
import { ReleaseQueryPacketComponent } from './components/release-monitoring/releasequery-packet/releasequery-packet.component';
import { MyquerypacketService } from './service/myquerypacket.service';
import { SubpacketPanierComponent } from './components/my-query-packet/subpacket-panier/subpacket-panier.component';
import { SubpacketTableComponent } from './components/my-query-packet/subpacket-table/subpacket-table.component';
import { NewquerypackageDialogComponent } from './components/my-query-packet/newquerypackage-dialog/newquerypackage-dialog.component';
import { GeneralIntroductionService } from './service/general-introduction.service';
import { ExtensionIndexService } from './service/extension-index.service';
import { SalesTargetService } from './service/sales-target.service';
import { ReleaseMonitoringService } from './service/release-monitoring.service';
import { OnlineStatisticsService } from './service/online-statistics.service';
import { ExpansionDerivationComponent } from './components/expansion-derivation/expansion-derivation.component';
import { SubderivationParationComponent } from './components/expansion-derivation/subderivation-paration/subderivation-paration.component';
import { SubderivationTableComponent } from './components/expansion-derivation/subderivation-table/subderivation-table.component';
import { ExpansionDerivationService } from './service/expansion-derivation.service';
import { DetailListComponent } from './components/general-introduction/detailList/detailList.component';
import { ReleaseDetailListComponent } from './components/release-monitoring/releaseDetailList/releaseDetailList.component';
import { OnlineDetailListComponent } from './components/online-statistics/onlineDetailList/onlineDetailList.component';
import { GeneralIntroductionAComponent } from './components/general-introductionA/general-introductionA.component';
import { SubgeneralTableAComponent } from './components/general-introductionA/subgeneral-tableA/subgeneral-tableA.component';
import { DetailListAComponent } from './components/general-introductionA/detailListA/detailListA.component';
import { GensearchCriteriaComponent } from './components/general-introductionA/gensearch-criteria/gensearch-criteria.component';
import { GensearchCriteriaService } from './service/gensearch-criteria.service';
import { GeneralIntroductionAService } from './service/general-introductionA.service';
import { GenqueryPacketAComponent } from './components/general-introductionA/genquery-packetA/genquery-packetA.component';
import { FlowRoutingModule } from './flow-routing.module';
import { TrafficRealTimeReportComponent } from './components/traffic-real-time-report/traffic-real-time-report.component';
import { TrafficSearchFormComponent } from './components/traffic-real-time-report/traffic-search-form/traffic-search-form.component';
import { TrafficTableComponent } from './components/traffic-real-time-report/traffic-table/traffic-table.component';
import { TrafficRealTimeReportService } from './service/traffic-real-time-report.service';
import { TrafficSearchFormService } from './service/traffic-search-form.service';


@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    // RouterModule.forChild(FLOWROUTES),
    FlowRoutingModule,
    CommonCustomModule,
    // NgZorroAntdModule
  ],
  providers: [FlowcommonformService, MyquerypacketService, GeneralIntroductionService, ExtensionIndexService, SalesTargetService,
    ReleaseMonitoringService, OnlineStatisticsService, ExpansionDerivationService, GensearchCriteriaService, GeneralIntroductionAService,
    TrafficRealTimeReportService, TrafficSearchFormService],
  declarations: [GeneralIntroductionComponent, ExtensionIndexComponent, SubreleaseTableComponent,
    ReleaseMonitoringComponent, SubonlineTableComponent, SubgeneralTableComponent, CommonFormComponent, SubsalesTableComponent,
    SubonlineParationComponent, SalesTargetComponent, OnlineStatisticsComponent, SubextensionTableComponent,
    GenqueryPacketComponent, MyQueryPacketComponent, SubpacketPanierComponent, SubpacketTableComponent, ExtQueryPacketComponent,
    SalesQueryPacketComponent, ReleaseQueryPacketComponent, NewquerypackageDialogComponent, ExpansionDerivationComponent,
    SubderivationParationComponent, SubderivationTableComponent, DetailListComponent, ReleaseDetailListComponent, OnlineDetailListComponent,
    GeneralIntroductionAComponent, SubgeneralTableAComponent, DetailListAComponent,
    GensearchCriteriaComponent, GenqueryPacketAComponent,
    TrafficRealTimeReportComponent, TrafficSearchFormComponent, TrafficTableComponent
  ]
})
export class FlowModule { }
