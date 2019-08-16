import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, AfterContentInit, AfterViewChecked } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { formattingTime } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { _reserveObject } from 'src/app/tools';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-electric-time',
  templateUrl: './electric-time.component.html',
  styleUrls: ['./electric-time.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ElectricTimeComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public echartsIntance = null;
  public echartsData = [];
  public deptId = '0';
  public isSpinning = false;
  public optionsLoading = false;
  public deptIdsOptions: Array<object> = [];
  private clientWidth: number;
  @ViewChild('electricTimeCharts', { static: false }) electricTimeCharts: ElementRef;
  constructor(private homeService: HomeService, private commonCustomService: CommonCustomService) { }

  ngOnInit() { }



  ngAfterViewInit() {
    this.clientWidth = this.electricTimeCharts.nativeElement.clientWidth;
    this.echartsIntance = echarts.init(this.electricTimeCharts.nativeElement);
    this.getElectricTimeData();
  }
  ngAfterViewChecked() {
    if (this.clientWidth !== this.electricTimeCharts.nativeElement.clientWidth) {
      this.clientWidth = this.electricTimeCharts.nativeElement.clientWidth;
      this.echartsIntance.resize({ width: this.electricTimeCharts.nativeElement.clientWidth });
    }
  }

  getElectricTimeData() {
    this.isSpinning = true;
    const params = { deptId: this.deptId };
    if (this.deptId === '0') {
      delete params['deptId'];
    }
    this.homeService.getAverageCall(params).subscribe(res => {
      this.isSpinning = false;
      const talkTimes = [];
      const periodWids = [];
      this.echartsData = res.result || [];
      this.echartsData.forEach(element => {
        talkTimes.push(element.talkTime);
        periodWids.push(element.periodWid);
      });
      this.setEcharts(periodWids, talkTimes);
    }, () => {
      this.isSpinning = false;
    });

  }

  getIndexDept(searchVal = '') {
    this.optionsLoading = true;
    this.commonCustomService.getIndexDept({ searchVal }).subscribe(res => {
      this.optionsLoading = false;
      this.deptIdsOptions = res.result;
    });
  }

  openDeptId() {
    if (!this.deptIdsOptions.length) {
      this.getIndexDept();
    }
  }
  deptIdChange(deptId: any) {
    this.deptId = deptId;
    this.getElectricTimeData();
  }

  setEcharts(periodWids, talkTimes) {
    const options = {
      color: ['#ffe6bb'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
          const html = `
            ${params[0]['axisValue']}<br />
            ${params[0]['marker']} ${params[0]['seriesName']}:
            ${formattingTime(params[0]['value'])}
          `;

          return html;
        },
      },
      grid: {
        top: '8%',
        left: '3%',
        right: '8%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: periodWids,
          splitLine: {
            show: false
          },
          axisTick: {
            alignWithLabel: true,
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
          name: '通话时长',
          type: 'bar',
          barWidth: '18px',
          data: talkTimes,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#333',
              formatter: (params) => {
                const html = `${formattingTime(params.value)}`;
                return html;
              }
            }
          },
        }
      ]
    };


    this.echartsIntance.setOption(options);
  }


}
