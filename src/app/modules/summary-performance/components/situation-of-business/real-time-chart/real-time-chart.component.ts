import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, AfterContentInit } from '@angular/core';

import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { _reserveObject, formattingTime } from 'src/app/tools';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HomeService } from 'src/app/modules/home/service/home.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SituationOfBusinessService } from '../../../service/situation-of-business.service';

@Component({
  selector: 'app-real-time-chart',
  templateUrl: './real-time-chart.component.html',
  styleUrls: ['./real-time-chart.component.scss'],

})
export class RealTimeChartComponent implements OnInit, AfterViewInit {
  @ViewChild('realTime', { static: false }) realTime: ElementRef;
  @ViewChild('electricTimeCharts', { static: false }) electricTimeCharts: ElementRef;
  public echartsIntance = null;
  public echartsData = [];
  public deptId = '0';
  public isSpinning = false;
  public optionsLoading = false;
  public deptIdsOptions: Array<object> = [];
  public advertisersTypeListOptions = [];
  public validateForm: FormGroup;
  private chartOptions: object = {};

  private legendData = [];
  private xTitle = [];
  private seriesChart = [];

  private queryDeptLineParams = {};
  private methondName = 'queryDeptLine';


  public carrierOptions: Array<object> = this.situationOfBusinessService.carrierOptions;
  constructor(private fb: FormBuilder, private situationOfBusinessService: SituationOfBusinessService, public commonCustomService: CommonCustomService) { }

  ngOnInit() {
    this._initForm();
    // fromEvent(window, 'resize').pipe(debounceTime(100)).subscribe(() => {
    //   this.reseteCharts();
    // });
    // this.echartsIntance = echarts.init(this.electricTimeCharts.nativeElement);
    // this.getAdvertisersTypeOptions();
  }

  /**
   * 获取推广方式
   */
  getAdvertisersTypeOptions() {
    this.commonCustomService.getAdvertisersTypeOptions().toPromise().then(res => {
      this.advertisersTypeListOptions = res.result;
      const advertisersTypeList = [];
      for (const iterator of this.advertisersTypeListOptions) {
        advertisersTypeList.push(Object.values(iterator)[0]);
      }
      this.validateForm.get('advertisersTypeList').patchValue(advertisersTypeList);
      this.getElectricTimeData();
    });
  }


  reseteCharts() {
    const width = this.realTime.nativeElement.clientWidth;
    this.echartsIntance.resize({ width });
  }

  private _initForm() {
    this.validateForm = this.fb.group({
      carrier: [1],
      dept0: ['全部'],
      advertisersTypeList: [[]]
    });
  }
  carrierChangeEvent(val) {
    this.methondName = val === 1 ? 'queryDeptLine' : 'queryTimeLine';
    this.getElectricTimeData();
  }
  alldept0ChangeEvent(val) {
    if (val === '全部') {
      delete this.queryDeptLineParams['patternId'];
    } else {
      this.queryDeptLineParams['patternId'] = val;
    }

    this.getElectricTimeData();
  }
  advertisersTypeChangeEvent(val) {
    this.setChartOption(this.filterType());
    this.setEcharts();
  }

  ngAfterViewInit() {
    // setTimeout(() => { this.reseteCharts(); }, 0);
    this.echartsIntance = echarts.init(this.electricTimeCharts.nativeElement);
    this.getAdvertisersTypeOptions();
  }

  getElectricTimeData() {
    this.isSpinning = true;
    this.situationOfBusinessService[this.methondName](this.queryDeptLineParams).subscribe(res => {
      this.isSpinning = false;
      this.echartsData = res.result || {};
      if (this.methondName === 'queryTimeLine') {
        this.formatData();
      }
      this.setChartOption(this.filterType());
      this.setEcharts();
    }, () => {
      this.isSpinning = false;
    });
  }
  /**
   * 格式化时间类型数据
   */
  formatData() {
    for (const key in this.echartsData) {
      if (this.echartsData.hasOwnProperty(key)) {
        const element = this.echartsData[key];
        for (const iterator of element) {
          iterator.showName = this.situationOfBusinessService.times.get(iterator.showName);
        }
      }
    }
  }


  /**
   * 根据推广方式筛选数据
   */
  filterType() {
    const x = {};
    for (const iterator of this.validateForm.get('advertisersTypeList').value) {
      x[iterator] = this.echartsData[iterator];
    }
    return x;
  }




  /**
   * 设置chart相关Option
   */
  setChartOption(echartsData) {
    const talkTimes = {};
    const periodWids = {};
    for (const key in echartsData) {
      if (echartsData.hasOwnProperty(key)) {
        const element = echartsData[key];
        if (element && Array.isArray(element)) {
          for (const iterator of element) {
            if (!talkTimes[key]) {
              talkTimes[key] = [];
            }
            if (!periodWids[key]) {
              periodWids[key] = [];
            }
            talkTimes[key].push(iterator.friallAc1);
            periodWids[key].push(iterator.showName);
            this.xTitle = periodWids[key];
          }
        }
      }
    }

    this.seriesChart = [];
    this.legendData = [];
    for (const key in talkTimes) {
      if (talkTimes.hasOwnProperty(key)) {
        const element = talkTimes[key];
        this.seriesChart.push({
          name: key,
          type: 'line',
          data: element,
          lineStyle: { color: this.situationOfBusinessService.colors[key] },
          itemStyle: { color: this.situationOfBusinessService.colors[key] }
        });

        this.legendData.push({ name: key });
      }
    }
  }


  setEcharts() {
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' }
      },
      legend: {
        data: this.legendData,
        bottom: 0
      },
      grid: {
        top: '8%',
        left: '2%',
        right: '5%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.xTitle,
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
          },
          rotate: 30
        }
      }],
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
      series: this.seriesChart
    };
    this.echartsIntance.setOption(this.chartOptions, true);
  }


}
