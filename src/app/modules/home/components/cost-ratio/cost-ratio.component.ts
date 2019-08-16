import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cost-ratio',
  templateUrl: './cost-ratio.component.html',
  styleUrls: ['./cost-ratio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CostRatioComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('costRatioCharts', { static: false }) costRatioCharts: ElementRef;
  public echartsIntance = null;
  public echartsData = [];
  public flowDataType = '0';
  public isSpinning = false;
  private clientWidth: number;

  constructor(private homeService: HomeService) { }

  ngOnInit() { }
  ngAfterViewInit() {
    this.clientWidth = this.costRatioCharts.nativeElement.clientWidth;
    this.echartsIntance = echarts.init(this.costRatioCharts.nativeElement);
    this.getCostRatioData();
  }
  ngAfterViewChecked() {
    if (this.clientWidth !== this.costRatioCharts.nativeElement.clientWidth) {
      this.clientWidth = this.costRatioCharts.nativeElement.clientWidth;
      this.echartsIntance.resize({ width: this.costRatioCharts.nativeElement.clientWidth });
    }
  }



  getCostRatioData(flowDataType: string = '0') {
    this.isSpinning = true;
    this.flowDataType = flowDataType;
    const params = { flowDataType: this.flowDataType };
    if (flowDataType === '0') {
      delete params['flowDataType'];
    }
    this.homeService.getSevenDayFeeRatio(params).subscribe(res => {
      this.isSpinning = false;
      const rate1s = [];
      const periodWids = [];
      this.echartsData = res.result || [];
      this.echartsData.forEach(element => {
        rate1s.push(element.rate1);
        periodWids.push(element.periodWid);
      });
      this.setEcharts(periodWids, rate1s);
    });
  }


  setEcharts(periodWids, rate1s) {
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            // backgroundColor: '#6a7985',
            formatter: (params) => {
              if (!params.seriesData.length) {
                return `${(params.value * 100).toFixed(2)}%`;
              }
              if (params.seriesData.length) {
                return params.value;
              }
            }
          }
        },
        formatter: (params) => {
          const html = `
          ${params[0]['axisValue']}<br />
          ${params[0]['marker']} ${params[0]['seriesName']}:
          ${((params[0]['value']) * 100).toFixed(2)}%
        `;
          return html;
        },
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
            },
            formatter: (value, index) => {
              return `${(value * 100).toFixed(2)}%`;
            }
          }
        }
      ],
      series: [
        {
          color: '#7bc6ff',
          name: '费率',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#333',
              formatter: (params) => {
                const html = `${(params.value * 100).toFixed(2)}%`;
                return html;
              }
            }
          },
          areaStyle: {
            normal: {
              // boderColor: '#25c7d2',
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#7bc6ff' },
                  { offset: 0.5, color: '#b7defc' },
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
          data: rate1s
        }
      ]
    };
    this.echartsIntance.setOption(options);
  }
}
