import { Component, OnInit, ViewEncapsulation, DoCheck, OnDestroy } from '@angular/core';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-realtime-kanban',
  templateUrl: './realtime-kanban.component.html',
  styleUrls: ['./realtime-kanban.component.scss'],

})
export class RealtimeKanbanComponent implements OnInit, OnDestroy {
  public isSpinning: Boolean = false;
  public dayData: Object = {};
  public weekData: Object = {};
  public monthData: Object = {};
  public timer = null;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getHomePage();
    this.timer = setInterval(() => {
      if (!this.isSpinning) {
        this.getHomePage();
      }
    }, 1000 * 60 * 2);
  }
  getHomePage() {
    this.isSpinning = true;
    this.homeService.getHomePage().subscribe(res => {
      this.isSpinning = false;
      const realTimeData = res.result;
      this.dayData = {
        type: '今天',
        flowCo: realTimeData.cardNumer && realTimeData.cardNumer.flowCo1,  // 今日名片数
        flowrate: realTimeData.cardNumer && realTimeData.cardNumer.rate1,  // 今日名片环比
        orderAmo: realTimeData.flow && realTimeData.flow.orderAmo1,   // 今日流水数
        rateAmo: realTimeData.flow && realTimeData.flow.rate1   // 今日流水环比
      };

      this.weekData = {
        type: '本周',
        flowCo: realTimeData.cardNumer && realTimeData.cardNumer.flowCo2,
        flowrate: realTimeData.cardNumer && realTimeData.cardNumer.rate2,
        orderAmo: realTimeData.flow && realTimeData.flow.orderAmo2,
        rateAmo: realTimeData.flow && realTimeData.flow.rate2
      };
      this.monthData = {
        type: '本月',
        flowCo: realTimeData.cardNumer && realTimeData.cardNumer.flowCo3,
        flowrate: realTimeData.cardNumer && realTimeData.cardNumer.rate3,
        orderAmo: realTimeData.flow && realTimeData.flow.orderAmo3,
        rateAmo: realTimeData.flow && realTimeData.flow.rate3
      };
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
