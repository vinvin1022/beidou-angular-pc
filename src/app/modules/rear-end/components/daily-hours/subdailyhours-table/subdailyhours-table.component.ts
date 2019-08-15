import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';

import { CommonrearformService } from '../../../service/commonrearform.service';
import { DailyHoursService } from '../../../service/dailyHours.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { SetMeetStandardComponent } from '../set-meet-standard/set-meet-standard.component';
import { setFinalFilterData } from 'src/app/tools';


@Component({
  selector: 'app-subdailyhours-table',
  templateUrl: './subdailyhours-table.component.html',
  styleUrls: ['./subdailyhours-table.component.scss']
})
export class SubdailyhoursTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
  @ViewChild('nzTable', { static: false }) overviewTableData: ElementRef;
  @ViewChild('setMeetStandard', { static: false }) setMeetStandard: SetMeetStandardComponent;
  public performanceParams = {};
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public subscribeAll$ = {};
  public displayData = [];
  public nzWidthConfig = [];
  public nzScroll = { y: '500px' };
  public isShowTimes = {
    efficacious: true,
    externalCall: true,
    averageTime: true
  };

  public filedsObject = {
    efficacious: {  // 有效通话数
      ishow: true,
      hiden: { start: 5, num: 7, widths: ['100px'] },
      show: { start: 5, num: 1, widths: ['70px', '70px', '70px', '70px', '70px', '70px', '70px'] }
    },
    externalCall: {  // 外呼通时
      ishow: true,
      hiden: { start: 12, num: 7, widths: ['120px'] },
      show: { start: 12, num: 1, widths: ['70px', '70px', '70px', '70px', '70px', '70px', '70px'] }
    },
    averageTime: {  // 通话均时
      ishow: true,
      hiden: { start: 19, num: 7, widths: ['100px'] },
      show: { start: 19, num: 1, widths: ['70px', '70px', '70px', '70px', '70px', '70px', '70px'] }
    }
  };
  public sortMap = {
    periodWid: null,
  };
  public sortName = null;
  public sortValue = null;

  public dailyTimes: Array<object>;
  constructor(private commonrearformService: CommonrearformService,
    private commonCustomService: CommonCustomService,
    private dailyHoursService: DailyHoursService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.pageIndex = 1;
      this.getDailyTime();
    }
  }
  ngOnInit() {
    this.setWidthConfig();
  }

  setWidthConfig() {
    this.nzWidthConfig = [
      '60px', '90px', '200px', '100px', '90px', '70px', '70px', '70px', '70px', '70px',
      '70px', '70px', '70px', '70px', '70px', '70px', '70px', '70px', '70px', '70px',
      '70px', '70px', '70px', '70px', '70px', '70px', '70px'];
  }
  showHidden(type) {
    this.filedsObject[type].ishow = this.filedsObject[type].ishow ? false : true;
    const { hiden, show } = this.filedsObject[type];
    if (!this.filedsObject[type].ishow) {
      this.nzWidthConfig.splice(hiden.start, hiden.num, ...hiden.widths);
      if (type === 'efficacious') {  // 有效通话数
        this.filedsObject['externalCall'].hiden.start = 6;
        this.filedsObject['externalCall'].show.start = 6;
        this.filedsObject['averageTime'].hiden.start = 13;
        this.filedsObject['averageTime'].show.start = 13;
      } else if (type === 'externalCall') {   // 外呼通时
        this.filedsObject['averageTime'].hiden.start = 7;
        this.filedsObject['averageTime'].show.start = 7;
      }
    } else {
      this.nzWidthConfig.splice(show.start, show.num, ...show.widths);
      if (type === 'efficacious') {
        this.filedsObject['externalCall'].hiden.start = 12;
        this.filedsObject['externalCall'].show.start = 12;
        this.filedsObject['averageTime'].hiden.start = 19;
        this.filedsObject['averageTime'].show.start = 19;
      } else if (type === 'externalCall') {
        this.filedsObject['averageTime'].hiden.start = 13;
        this.filedsObject['averageTime'].show.start = 13;
      }
    }

    const nums = this.nzWidthConfig.reduce((allnum, next) => {
      return allnum += parseInt(next, 10);
    }, 0);
    this.nzScroll['x'] = nums + 'px';

  }
  /**
   * 获取通时达标值
   */
  getCommonDailyTime() {
    this.subscribeAll$['getCommonDailyTime$'] = this.dailyHoursService.getCommonDailyTime().subscribe(res => {
      this.dailyTimes = res.result;
    });
  }


  pageIndexChange(pageIndex) {
    this.getDailyTime();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.getDailyTime();
  }

  /**
  * 获取表格数据
  */
  getDailyTime() {
    this.getCommonDailyTime();
    this.loading = this.commonrearformService.loading = true;
    this.setPerformanceParams();
    this.subscribeAll$['getDailyTime$'] = this.dailyHoursService.getDailyTime(this.performanceParams).subscribe(res => {
      this.nzScroll['x'] = '2080px';
      const newList = res.result.list.map((value) => {
        value['deptNameLabel'] = this.performanceParams['deptNameLabel'] || '';
        return value;
      });
      this.displayData = newList;
      this.total = res.result.total;
      this.loading = this.commonrearformService.loading = false;
    }, () => {
      this.loading = this.commonrearformService.loading = false;
    });
  }

  /**
  * 自营业绩导出
  */
  exportDailyTime() {
    const params = {};
    const includesArr = ['pageNo', 'pageSize'];
    for (const key in this.performanceParams) {
      if (this.performanceParams.hasOwnProperty(key)) {
        const element = this.performanceParams[key];
        if (!includesArr.includes(key)) {
          params[key] = element;
        }
      }
    }
    this.dailyHoursService.exportDailyTime({ ...params });
  }

  /**
  * 设置查询参数
  */
  setPerformanceParams() {
    this.performanceParams = setFinalFilterData(this.filterData);
    this.performanceParams['pageNo'] = this.pageIndex;
    this.performanceParams['pageSize'] = this.pageSize;
  }

  /**
   * @param sortName String  排序名称
   * @param value String  排序类型（升序，降序）
   */
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.sortMap) {
      if (this.sortMap.hasOwnProperty(key)) {
        this.sortMap[key] = (key === sortName ? value : null);
      }
    }
    if (this.sortName && this.sortValue) {
      this.displayData = [...this.displayData.sort((a, b) =>
        (this.sortValue === 'ascend') ?
          (a[this.sortName] > b[this.sortName] ? 1 : -1) :
          (b[this.sortName] > a[this.sortName] ? 1 : -1)
      )];
    } else {
      this.displayData = [...this.displayData];
    }
  }

  /**
   * 设置通时达标值后重新计算每日通时达标率
   */
  recalculate() {
    this.getCommonDailyTime();
  }
  showMeetStandard() {
    this.setMeetStandard.handleCancel(true);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
