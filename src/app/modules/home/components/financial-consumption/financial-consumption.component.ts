import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, AfterContentInit, AfterViewChecked } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-financial-consumption',
  templateUrl: './financial-consumption.component.html',
  styleUrls: ['./financial-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinancialConsumptionComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public echartsIntance = null;
  public echartsData = [];
  public flowDataType: String = '0';
  public isSpinning: Boolean = false;
  private _clientWidth: number;

  @ViewChild('consumptionCharts', { static: false }) consumptionCharts: ElementRef;

  constructor(private homeService: HomeService) { }

  ngOnInit() {}



  ngAfterViewInit() {
    this._clientWidth = this.consumptionCharts.nativeElement.clientWidth;
    this.echartsIntance = echarts.init(this.consumptionCharts.nativeElement);
    this.getSevenDayFinance();
    // setTimeout(() => { this.reseteCharts(); }, 0);
  }
  ngAfterViewChecked() {
    if (this._clientWidth !== this.consumptionCharts.nativeElement.clientWidth) {
      this._clientWidth = this.consumptionCharts.nativeElement.clientWidth;
      this.echartsIntance.resize({ width: this.consumptionCharts.nativeElement.clientWidth });
    }
  }

  getSevenDayFinance(flowDataType: string = '0') {
    this.isSpinning = true;
    this.flowDataType = flowDataType;
    const params = { flowDataType };
    if (flowDataType === '0') {
      delete params['flowDataType'];
    }
    this.homeService.getSevenDayFinance(params).subscribe(res => {
      this.isSpinning = false;
      const financeAmounts = [];
      const periodWids = [];
      this.echartsData = res.result || [];
      this.echartsData.forEach(element => {
        financeAmounts.push(element.financeAmount);
        periodWids.push(element.periodWid);
      });
      this.setEcharts(periodWids, financeAmounts);
    });
  }

  setEcharts(periodWids, financeAmounts) {
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            // backgroundColor: '#25c7d2'
          }
        }
      },
      toolbox: {
        // feature: {
        //   saveAsImage: {}
        // }
      },
      grid: {
        top: '8%',
        left: '3%',
        right: '10%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: periodWids,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: { color: '#ccc' }
          },
          axisLabel: {
            textStyle: {
              color: '#555'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: { color: '#ccc' }
          },
          axisLabel: {
            textStyle: {
              color: '#555'
            }
          }
        }
      ],
      series: [
        {
          color: '#25c7d2',
          name: '财务消费',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#333'
            }
          },
          areaStyle: {
            normal: {
              // boderColor: '#25c7d2',
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#25c7d2' },
                  { offset: 0.5, color: '#91f3fa' },
                  { offset: 1, color: '#ffffff' }
                ]
              )
            },
            emphasis: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#fff000' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          data: financeAmounts
        }
      ]
    };

    this.echartsIntance.setOption(options);
  }

}
