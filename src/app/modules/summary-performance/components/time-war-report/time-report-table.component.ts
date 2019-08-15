import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { FrontRealReportService } from 'src/app/modules/front-end/service/front-real-report.service';
import { FrontRealFormService } from 'src/app/modules/front-end/service/front-real-form.service';
import { FrontendService } from 'src/app/modules/front-end/service/frontend.service';
import { frontRealReportCustomFieldData } from 'src/app/modules/front-end/service/front-realCustomFieldData';
import { timeWarReportFieldData } from '../../service/timeWarReportFieldData';
import { TimeWarReportService } from '../../service/time-war-report.service';



@Component({
  selector: 'app-time-report-table',
  templateUrl: './time-report-table.component.html',
  styleUrls: ['./time-report-table.component.scss']
})
export class TimeReportTableComponent implements OnInit, OnDestroy {
  @Input() filterData;
  public bduploadFileUrl = 'dms/excl/import/warNewsImport';
  public customColumnData: Object = {};
  public filterFieldData;
  public loading: Boolean = false;
  public subscribeAll$: Object = {};
  public targetNetSaleParams: Object = {};
  public exportsParams: Object = {};

  public allChildren = [];
  public fieldKeys: Array<string> = [];
  public widthConfig: Array<string> = [];
  public scrollConfig: Object = {};

  public downloadTemplateUrl =
    `https://sx-silk-bag.oss-cn-shenzhen.aliyuncs.com/file/%E6%88%98%E6%8A%A5%E7%9B%AE%E6%A0%87%E4%B8%9A%E7%BB%A9%E6%A8%A1%E6%9D%BF.xlsx`;

  expandDataCache = {};
  tableTreeData = [];
  constructor(
    private customColumnDialogService: CustomColumnDialogService, private timeWarReportService: TimeWarReportService,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService) { }

  ngOnInit() {
    this.setWidthScrollConfig();
    this.getDivisonNetSaleData();
  }

  refurbish() {
    this.getDivisonNetSaleData();
  }



  /**
  * 获取自定义列过滤数据
  * @param data
  */
  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(timeWarReportFieldData);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }


  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['230px']);
      this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
    } else {
      this.widthConfig = ['100px'];
      this.scrollConfig = { x: '100px', y: '100px' };
    }
  }

  /**
   * 设置getTargetNetSale() 参数
   */
  setTargetNetSaleParams() {
    this.targetNetSaleParams = Object.assign({}, this.filterData);
    this.targetNetSaleParams['range'] = 1;
    this.exportsParams = { ...this.targetNetSaleParams };
  }



  /**
   * 实时导出
   */
  exportWarNews() {
    this.timeWarReportService.exportWarNews();
  }


  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.loading = this.timeWarReportService.loading = true;
    this.subscribeAll$['queryWarNews$'] = this.timeWarReportService.queryWarNews()
      .subscribe(res => {
        // this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
        this.tableTreeData = res.result;
        this.initTreeTable();
        this.getFilterField();
        this.loading = this.timeWarReportService.loading = false;
      }, () => {
        this.loading = this.timeWarReportService.loading = false;
      });
  }




  /**
   * 展开表格树形操作
   * @param array
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    // this.targetNetSaleParams['range'] = data['level'] + 2;
    // this.getTableTreeData(data);
    this.tableTreeService.collapse(array, data, $event);
  }


  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.timeWarReportService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, [], [], true);
    });
    // this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    // this.frontRealFormService.loading = false;
  }
}
