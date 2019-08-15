import {
  Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, AfterContentInit,
  Input, OnChanges, SimpleChange, SimpleChanges, AfterViewChecked, Output, EventEmitter
} from '@angular/core';
import { _reserveObject } from 'src/app/tools';
import { WorkOrderReportService } from '../../../service/work-order-report.service';

@Component({
  selector: 'app-after-salecategory',
  templateUrl: './after-salecategory.component.html',
  styleUrls: ['./after-salecategory.component.scss']
})
export class AfterSalecategoryComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  @Input() private requestParams;
  private _echartsIntance = null;
  public echartsData = [];
  public isSpinning: Boolean = false;
  @ViewChild('salecategory', { static: false }) salecategory: ElementRef;
  @Output() sendBigId: EventEmitter<any> = new EventEmitter();
  private _clientWidth: number;
  constructor(private _workOrderReportService: WorkOrderReportService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestParams.currentValue && !changes.requestParams.firstChange) {
      this.queryBigTypeNum();
    }
  }


  ngAfterViewInit() {
    this._clientWidth = this.salecategory.nativeElement.clientWidth;
    this._echartsIntance = echarts.init(this.salecategory.nativeElement);
    this._echartsIntance.on('click', 'series.pie', (params) => {
      console.log(params, this.echartsData);
      const bigId = this.echartsData.find(item => item.typeName === params.name).typeId;
      this.sendBigId.emit(bigId);
    });
  }
  ngAfterViewChecked() {
    if (this._clientWidth !== this.salecategory.nativeElement.clientWidth) {
      this._clientWidth = this.salecategory.nativeElement.clientWidth;
      this._echartsIntance.resize({ width: this.salecategory.nativeElement.clientWidth });
    }
  }


  queryBigTypeNum() {
    this.isSpinning = true;
    this._workOrderReportService.queryBigTypeNum(this.requestParams).subscribe(res => {
      this.echartsData = res.result;
      this._echartsIntance.setOption(this.setChartsOptions(res.result));
      this.isSpinning = false;
    });
  }

  setChartsOptions(datax = []) {
    const data = this._genData(datax);
    const options = {
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: 12
        },
        formatter: function (params) {
          console.log(params);
          const html = `
          ${params['data']['name']}<br/>
          数量：${params['data']['typeNum']}<br/>
          比例：${params['data']['value']}%
          `;
          return html;
        },
      },
      legend: {
        left: 'center',
        bottom: 0,
        data: data.legendData
      },
      series: [
        {
          type: 'pie',
          radius: '75%',
          center: ['50%', '50%'],
          data: data.seriesData,
        }
      ]
    };
    return options;
  }


  private _genData(count) {
    const legendData = [];
    const seriesData = [];
    const colors = ['#F47F92', '#5DB1FF', 'rgb(255,159,157)', 'rgb(255,219,92)', 'rgb(159,239,24)', 'rgb(255,159,127)', 'rgb(255,230,187)'];
    count.forEach((value, index) => {
      legendData.push(value.typeName);
      seriesData.push({
        name: value.typeName, value: value.rate, typeNum: value.typeNum, itemStyle: {
          color: colors[index],
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      });
    });

    return { legendData, seriesData };

  }


}
