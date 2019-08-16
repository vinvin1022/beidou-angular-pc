import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, SimpleChanges, OnChanges, Input, AfterViewChecked } from '@angular/core';

import { _reserveObject } from 'src/app/tools';
import { WorkOrderReportService } from '../../../service/work-order-report.service';


@Component({
  selector: 'app-after-salesubcategory',
  templateUrl: './after-salesubcategory.component.html',
  styleUrls: ['./after-salesubcategory.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AfterSalesubcategoryComponent implements AfterViewInit, OnChanges, AfterViewChecked {
  @Input() private requestParams;
  @Input() private bigId;

  @ViewChild('salesubcategory', { static: false }) salesubcategory: ElementRef;
  private echartsIntance = null;
  public echartsData = [];
  public isSpinning = false;
  private clientWidth: number;
  constructor(private workOrderReportService: WorkOrderReportService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestParams && changes.requestParams.currentValue && !changes.requestParams.firstChange) {
      this.querySmallTypeNum();
    }
    if (changes.bigId && changes.bigId.currentValue && !changes.bigId.firstChange) {
      this.querySmallTypeNum();
    }
  }


  ngAfterViewInit() {
    this.clientWidth = this.salesubcategory.nativeElement.clientWidth;
    this.echartsIntance = echarts.init(this.salesubcategory.nativeElement);

  }
  ngAfterViewChecked() {
    if (this.clientWidth !== this.salesubcategory.nativeElement.clientWidth) {
      this.clientWidth = this.salesubcategory.nativeElement.clientWidth;
      this.echartsIntance.resize({ width: this.salesubcategory.nativeElement.clientWidth });
    }
  }

  querySmallTypeNum() {
    this.isSpinning = true;
    if (this.bigId) {
      this.requestParams['bigId'] = this.bigId;
    }
    this.workOrderReportService.querySmallTypeNum(this.requestParams).subscribe(res => {
      this.echartsData = res.result;
      this.echartsIntance.setOption(this._setChartsOptions(res.result));
      this.isSpinning = false;
      this.bigId = null;
    });
  }
  private _genData(data = []) {
    const yAxisData = [];
    const seriesData = [];
    data.forEach((value, index) => {
      yAxisData.push(value.typeName);
      seriesData.push({ value: value.typeNum, name: value.typeName, parentName: value.parentName });
    });

    return { yAxisData, seriesData };
  }

  private _setChartsOptions(data) {

    const { yAxisData, seriesData } = this._genData(data);
    const options = {
      color: ['#5DB1FF'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        textStyle: {
          fontSize: 12
        },
        formatter: (params) => {
          const html = `
            ${params[0]['data']['parentName']}<br />
            ${params[0]['name']}: ${params[0]['value']}
          `;
          return html;
        },
      },
      grid: {
        top: '2%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisTick: {
          alignWithLabel: true,
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ccc',
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: { color: '#ccc' },
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#555'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisTick: {
          alignWithLabel: true,
          show: true,
          color: '#ccc'
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
      },
      series: [
        {
          type: 'bar',
          data: seriesData
        }
      ]
    };
    return options;
  }



}




