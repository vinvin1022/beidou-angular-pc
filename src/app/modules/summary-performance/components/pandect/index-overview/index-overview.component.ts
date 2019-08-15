import { Component, OnInit, ViewEncapsulation, OnChanges, Input, OnDestroy } from '@angular/core';

import { formatDate } from '../../../../../tools';
import { SelectAllService } from 'src/app/service/select-all.service';
import { PandectService } from '../../../service/pandect.service';

@Component({
  selector: 'app-index-overview',
  templateUrl: './index-overview.component.html',
  styleUrls: ['./index-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndexOverviewComponent implements OnInit, OnChanges, OnDestroy {
  public indexoverviewparams = {};
  public pageInfoLoading: Boolean = false;
  public displayData;
  public pageInfo2: Array<any> = [];
  public pageInfo1: Array<any> = [];
  public pageInfo1Title: Array<any> = [];
  public pageInfo2Title: Array<any> = [];
  public nz1ScrollData: Object = {};
  public nz2ScrollData: Object = {};
  public pageInfo1List: Array<any> = [];
  public pageInfo2List: Array<any> = [];

  public nzWidthConfig1: Array<any> = [];
  public nzWidthConfig2: Array<any> = [];

  public getIndexItem$;
  @Input('filterData') filterData;
  constructor(private pandect: PandectService, private selectAllService: SelectAllService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.setTableData();
    }
  }

  /**
   * 设置查询参数
   */
  setFinalsearchData(): Object {
    const filterData = this.filterData;
    const indexoverviewparams = {};
    for (const key in filterData) {
      if (filterData.hasOwnProperty(key)) {
        const element = filterData[key];
        if (element && Array.isArray(element) && element.length) {
          if (key === 'rangePicker') {
            if (element[0]) {
              indexoverviewparams['startTime'] = formatDate(element[0], 'yyyy-MM-dd');
            }
            if (element[1]) {
              indexoverviewparams['endTime'] = formatDate(element[1], 'yyyy-MM-dd');
            }
          } else if (key === 'dept') {
            this.selectAllService.optionsData.forEach(item => {
              element.forEach(sitem => {
                if (sitem === item['optionId']) {
                  if (!indexoverviewparams['dept']) {
                    indexoverviewparams['dept'] = [];
                  } else { }
                  indexoverviewparams['dept'].push(item['optionId']);
                  if (!indexoverviewparams['deptName']) {
                    indexoverviewparams['deptName'] = [];
                  }
                  indexoverviewparams['deptName'].push(item['optionName']);
                }
              });
            });

          } else {
            indexoverviewparams[key] = element;
          }
        } else if (element && typeof element === 'string') {
          indexoverviewparams[key] = element;
        }
      }
    }
    this.indexoverviewparams = indexoverviewparams;
    return indexoverviewparams;

  }
  ngOnInit(): void {
    // this.setRequestData();
    // this.setTableData();
  }
  /**
   * 设置首次加载表格 请求默认值
   */
  setRequestData() {
    this.filterData = {
      dept: this.pandect.defaultFormData['dept'],   // 报名城市
      periodType: this.pandect.defaultFormData['periodType'],  // 业务模式
      rangePicker: this.pandect.defaultFormData['rangePicker'],  // 推广项目
      indexItem: this.pandect.defaultFormData['indexItem'],   // 时间类型
    };
  }





  indexItemExport() {
    this.pandect.indexItemExport({ ...this.indexoverviewparams });
  }

  /**
   * 设置pageInfo1Title
   */
  _setPageInfoTitle(infoTable) {
    const titles = [];
    for (const key in infoTable[0]) {
      if (infoTable[0].hasOwnProperty(key)) {
        titles.push(infoTable[0][key]);
      }
    }
    return titles;
  }


  /**
   * 重新组装返回数据 主要填补某些日期无数据返回情况
   * @param pageInfoList Object
   */
  private _setTimeData(pageInfoList) {
    const allObj = {};    // 以时间为key组装数据
    const deptNameList = {};  // 以军团为key组装数据

    pageInfoList.forEach((value, index) => {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          if (key === 'periodWid') {
            if (!allObj[value[key]]) {
              allObj[value[key]] = [];
            }
            allObj[value[key]].push(value);
          }
          if (key === 'deptName') {
            if (!deptNameList[value[key]]) {
              deptNameList[value[key]] = [];
            }
            deptNameList[value[key]].push(value);
          }
        }
      }
    });

    const times = Object.keys(allObj);  //  获取具体时间数组


    for (const key in deptNameList) {
      if (deptNameList.hasOwnProperty(key)) {
        const depItem = deptNameList[key];
        const depTimes = [];
        for (let index = 0, len = depItem.length; index < len; index++) {   // 筛选出每个军团下面的时间
          const timeit = depItem[index];
          depTimes.push(timeit.periodWid);
        }

        const diffTime = [];
        for (let index = 0, len = times.length; index < len; index++) {   // 与所有时间（times）对比 筛选出军团下面没有数据的时间
          const it = times[index];
          if (!depTimes.includes(it)) {
            diffTime.push(it);
          }
        }

        const fArr = [];

        for (let index = 0, len = diffTime.length; index < len; index++) {   // 填补时间对象
          const element = diffTime[index];
          fArr.push({
            periodWid: element,
            deptName: key,
            indexItem: null
          });
        }
        deptNameList[key].unshift(...fArr);   // 重组军团数据
        deptNameList[key].sort((a, b) => {  // 对军团数据以时间排序
          const startItem = a.periodWid && parseInt((a.periodWid).replace(/-/g, ''), 10);
          const endItem = b.periodWid && parseInt((b.periodWid).replace(/-/g, ''), 10);
          return startItem - endItem;
        });

        const findItemIndex = deptNameList[key].findIndex(item => item['periodWid'] === '合计');
        const findItem = deptNameList[key].find(item => item['periodWid'] === '合计');

        deptNameList[key].splice(findItemIndex, 1);
        deptNameList[key].push(findItem);

      }
    }

    // times.push('合计');
    return { deptNameList, times };
  }

  private _setPathInfoData(pageInfoList) {
    const allObj = pageInfoList;
    const deptNameObj = {};  // 部门数据
    const per = ['8', '9', '10'];  // ROI 销转 有效率合计 加%号


    for (const key in allObj) {
      if (allObj.hasOwnProperty(key)) {
        deptNameObj[key] = { a0: key };
        const len = allObj[key].length;
        for (let index = 0; index < len; index++) {
          for (const pk in allObj[key][index]) {
            if (allObj[key][index].hasOwnProperty(pk)) {
              const dNum = allObj[key][index][pk];
              if (pk === 'indexItem') {
                if ((dNum || dNum === 0) && per.includes(this.indexoverviewparams['indexItem'])) {
                  deptNameObj[key]['a' + (index + 1)] = dNum.toFixed(2) + '%';
                } else {
                  deptNameObj[key]['a' + (index + 1)] = dNum;
                }
              }
            }
          }
        }
      }
    }

    const pageInfo = Object.values(deptNameObj);  // 存放表格
    return { pageInfo };
  }




  /**
   * 获取表格数据
   */
  setTableData(): void {
    this.pageInfoLoading = this.pandect.loading = true;
    this.setFinalsearchData();
    this.getIndexItem$ = this.pandect.getIndexItem(this.indexoverviewparams).subscribe(res => {


      if (res.result && res.result.pageInfo1 && res.result.pageInfo1.length) {
        const pageInfo1List = this._setTimeData(res.result && res.result.pageInfo1 || []);
        const tableObj1 = this._setPathInfoData(pageInfo1List.deptNameList);
        this.pageInfo1 = tableObj1.pageInfo;
        pageInfo1List.times.unshift('咨询部门 / 时间');
        this.pageInfo1Title = pageInfo1List.times;
        this.nz1ScrollData = { x: `${(pageInfo1List.times.length - 1) * 100 + 170}px` };
        this.nzWidthConfig1 = this.setTdWith(this.pageInfo1Title);
      } else {
        this.pageInfo1 = [];
        this.pageInfo1Title = [];
        this.nzWidthConfig1 = [];
      }


      if (res.result && res.result.pageInfo1 && res.result.pageInfo1.length) {
        const pageInfo2List = this._setTimeData(res.result && res.result.pageInfo2 || []);
        const tableObj2 = this._setPathInfoData(pageInfo2List.deptNameList);
        this.pageInfo2 = tableObj2.pageInfo;
        pageInfo2List.times.unshift('咨询部门 / 时间');
        this.pageInfo2Title = pageInfo2List.times;
        this.nz2ScrollData = { x: `${(pageInfo2List.times.length - 1) * 100 + 170}px` };
        this.nzWidthConfig2 = this.setTdWith(this.pageInfo2Title);
      } else {
        this.pageInfo2 = [];
        this.pageInfo2Title = [];
        this.nzWidthConfig2 = [];
      }

      this.pageInfoLoading = this.pandect.loading = false;
    }, error => {
      this.pageInfoLoading = this.pandect.loading = false;
    });
  }

  setTdWith(pageInfoTitle) {
    const nzWidthConfig = ['170px'];
    for (let index = 1; index < pageInfoTitle.length; index++) {
      nzWidthConfig.push('100px');
    }
    return nzWidthConfig;
  }

  ngOnDestroy() {
    if (this.getIndexItem$) {
      this.getIndexItem$.unsubscribe();
    }
  }

}
