import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { _reserveObject } from 'src/app/tools';
import { debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-appointment-sheet',
  templateUrl: './appointment-sheet.component.html',
  styleUrls: ['./appointment-sheet.component.scss']
})
export class AppointmentSheetComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('appointmentSheetCharts', { static: false }) appointmentSheetCharts: ElementRef;
  public echartsIntance = null;
  public echartsData = [];
  public deptId = '0';
  public isSpinning = false;
  public optionsLoading = false;
  public deptIdsOptions: Array<object> = [];
  private clientWidth: number;

  constructor(private homeService: HomeService, private commonCustomService: CommonCustomService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.clientWidth = this.appointmentSheetCharts.nativeElement.clientWidth;
    this.echartsIntance = echarts.init(this.appointmentSheetCharts.nativeElement);
    this.getAppointmentSheetData();
  }
  ngAfterViewChecked() {
    if (this.clientWidth !== this.appointmentSheetCharts.nativeElement.clientWidth) {
      this.clientWidth = this.appointmentSheetCharts.nativeElement.clientWidth;
      this.echartsIntance.resize({ width: this.appointmentSheetCharts.nativeElement.clientWidth });
    }
  }

  getAppointmentSheetData() {
    this.isSpinning = true;
    // const params = { deptId: this.deptId };
    const params = { deptId: this.deptId };

    if (this.deptId === '0') {
      delete params['deptId'];
    }
    this.homeService.getBookForm(params).subscribe(res => {
      this.isSpinning = false;

      const deptNames = [];
      const resordersAcos = [];
      const periodWids = [];
      this.echartsData = res.result || [];
      this.echartsData.forEach(element => {
        deptNames.push(element.deptName);
        periodWids.push(element.periodWid);
        resordersAcos.push(element.resordersAco);
      });
      this.setEcharts(periodWids, resordersAcos);
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
    this.getAppointmentSheetData();
  }

  setEcharts(periodWids, resordersAcos) {
    const options = {
      color: ['#FF7E89'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
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
          name: '预约单',
          type: 'bar',
          barWidth: '18px',
          data: resordersAcos,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#333'
            }
          }
        }
      ]
    };
    this.echartsIntance.setOption(options);
  }




}
