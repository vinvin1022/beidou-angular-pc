import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-performance-ranking',
  templateUrl: './performance-ranking.component.html',
  styleUrls: ['./performance-ranking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerformanceRankingComponent implements OnInit, OnDestroy {
  public achievementData: Array<Object> = [];
  public isSpinning: Boolean = false;
  public orderDate: String = 'day';
  public topThree: Array<Object> = [];
  public bottomThree: Array<Object> = [];
  public timer = null;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getAchievementData(this.orderDate);

    this.timer = setInterval(() => {
      if (!this.isSpinning) {
        this.getAchievementData(this.orderDate);
      }
    }, 1000 * 60 * 2);
  }
  getAchievementData(type): void {
    this.isSpinning = true;
    this.orderDate = type;
    this.homeService.getPerferRank({ orderDate: this.orderDate }).subscribe(res => {
      this.topThree = [];
      this.bottomThree = [];
      this.achievementData = res.result.filter(item => item.deptName);
      const len = this.achievementData.length;
      this.topThree = this.achievementData.filter((value, index) => index < 10);

      for (let index = 3; index > 0; index--) {
        if (this.achievementData[len - index]) {
          this.achievementData[len - index]['rank'] = len - index + 1;
          this.bottomThree.push(this.achievementData[len - index]);
        }
      }

      this.isSpinning = false;

    });
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
