import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArmyDataAnalysisComponent } from './components/army-data-analysis/army-data-analysis.component';
import { ArmyFlowAnalysisComponent } from './components/army-flow-analysis/army-flow-analysis.component';

const MIDDLEENDROUTES: Routes = [
  {path: '', redirectTo: '/middleend/armyDataAnalysis', pathMatch: 'full'},
  {path: 'armyDataAnalysis', component: ArmyDataAnalysisComponent ,
  data: {
    name: '军团数据分析',
    breadcrumb: '军团数据分析'
  }
},
  {path: 'armyFlowAnalysis', component: ArmyFlowAnalysisComponent,
  data: {
    name: '军团流量分析',
    breadcrumb: '军团流量分析'
  }}
];

@NgModule({
  imports: [RouterModule.forChild(MIDDLEENDROUTES)],
  exports: [RouterModule]
})
export class MiddleEndRoutingModule { }
