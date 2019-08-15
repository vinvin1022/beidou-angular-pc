import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeService } from './service/home.service';
import { HomeIndexComponent } from './components/index/index.component';

import { RealtimeKanbanComponent } from './components/realtime-kanban/realtime-kanban.component';

import { PerformanceRankingComponent } from './components/performance-ranking/performance-ranking.component';
import { DataBlockComponent } from './components/data-block/data-block.component';
import { FinancialConsumptionComponent } from './components/financial-consumption/financial-consumption.component';
import { ElectricTimeComponent } from './components/electric-time/electric-time.component';
import { AppointmentSheetComponent } from './components/appointment-sheet/appointment-sheet.component';
import { CostRatioComponent } from './components/cost-ratio/cost-ratio.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AchievementComponent } from './components/achievement/achievement.component';
import { CommonCustomModule } from '../common-custom/common-custom.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CommonCustomModule
  ],
  providers: [HomeService],
  declarations: [HomeIndexComponent, RealtimeKanbanComponent, PerformanceRankingComponent,
    DataBlockComponent,
    FinancialConsumptionComponent,
    ElectricTimeComponent,
    AppointmentSheetComponent,
    CostRatioComponent, AchievementComponent],
  exports: []
})
export class HomeModule { }
