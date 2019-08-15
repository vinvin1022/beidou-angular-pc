import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AchievementComponent implements OnInit, AfterViewInit, OnDestroy {
  public achievementData: Array<Object> = [];
  public isSpinning: Boolean = false;
  public orderDate: String = 'day';

  public timer = null;
  public echartsIntance;
  @ViewChild('eyeAchievement', { static: false }) eyeAchievement: ElementRef;
  public width: Number = 0;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getAchievementData(this.orderDate);

    this.timer = setInterval(() => {
      if (!this.isSpinning) {
        this.getAchievementData(this.orderDate);
      }
    }, 1000 * 60 * 2);
  }

  ngAfterViewInit() {
    this.echartsIntance = echarts.init(document.getElementById('achievement-charts'));
    this.getAchievementData(this.orderDate);
    setTimeout(() => {
      this.width = this.eyeAchievement.nativeElement.clientWidth;
      this.echartsIntance.resize({
        width: this.width
      });
    }, 0);
  }


  getAchievementData(orderDate) {
    this.isSpinning = true;
    this.orderDate = orderDate;
    this.homeService.getPerferRank({ orderDate: this.orderDate }).subscribe(res => {
      this.isSpinning = false;
      const financeAmounts = [];
      const periodWids = [];
      const topNum = <Array<any>>res.result.slice(0, 11);
      const newData = topNum.filter(item => item['deptName']);
      newData.forEach(element => {
        financeAmounts.push(element.orderAmo);
        periodWids.push(element.deptName);
      });
      this.setEcharts(periodWids, financeAmounts);
    });
  }

  setEcharts(periodWids, financeAmounts) {
    const options = {
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'cross',
        //   // label: {
        //   //   backgroundColor: '#6a7985'
        //   // }
        // }
      },
      toolbox: {
        // feature: {
        //   saveAsImage: {}
        // }
      },
      grid: {
        top: '2%',
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: 'category',
          boundaryGap: false,
          data: periodWids
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '收入',
          type: 'line',
          areaStyle: {},
          data: financeAmounts
        }
      ]
    };

    this.echartsIntance.setOption(options);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
