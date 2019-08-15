import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';



import { ReachOrderTasksformService } from '../../../service/reach-order-tasksform.service';
import { tasksDuringServiceCustomFieldData } from '../../../service/tasks-during-serviceCustomFieldData';
import { TasksDuringServiceService } from '../../../service/tasks-during-service.service';


@Component({
  selector: 'app-during-service-table',
  templateUrl: './during-service-table.component.html',
  styleUrls: ['./during-service-table.component.scss']
})
export class DuringServiceTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData;
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


  tableTreeData = [];
  expandDataCache = {};
  constructor(private tasksDuringServiceService: TasksDuringServiceService, private reachOrderTasksformService: ReachOrderTasksformService,

    private customColumnDialogService: CustomColumnDialogService,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getDivisonNetSaleData();
    }
  }
  ngOnInit() {
    this.setWidthScrollConfig();
  }




  /**
  * 获取自定义列过滤数据
  * @param data
  */
  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(tasksDuringServiceCustomFieldData);
    this.filterFieldData = newData.selectField;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.allChildren = newData.allChildren;
    this.setWidthScrollConfig();
  }


  setWidthScrollConfig() {
    if (this.tableTreeData.length) {
      this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length,
        ['230px'], '108px');
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
  exportsFile() {
    this.exportsParams['range'] = 5;
    this.tasksDuringServiceService.saveDealCycleQueryVO(this.exportsParams).subscribe(res => {
      this.tasksDuringServiceService.exportDealCycle({ ridesKey: res.result });
    });
  }





  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.loading = this.reachOrderTasksformService.loading = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$['queryDealCycle$'] = this.tasksDuringServiceService.queryDealCycle(this.targetNetSaleParams)
      .subscribe(res => {
        this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result || []);
        this.initTreeTable();
        this.loading = this.reachOrderTasksformService.loading = false;
        this.getFilterField();
      }, () => {
        this.loading = this.reachOrderTasksformService.loading = false;
      });
  }

  /**
   * 获取报表数据
   * @param data object 当前数据
   * @param methodName string 请求方法名
   */
  getTableTreeData(data: object = {}) {
    const params = { ...this.targetNetSaleParams };
    if (!(data['children'] && data['children'].length)) {
      this.loading = this.reachOrderTasksformService.loading = true;
      this.subscribeAll$['queryDealCycle$'] = this.tasksDuringServiceService.queryDealCycle(params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.reachOrderTasksformService.loading = false;
      });
    }
  }


  /**
   * 展开表格树形操作
   * @param array
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    this.targetNetSaleParams = Object.assign({}, this.filterData);
    const deptId = ['dept', 'legion', 'group', 'userId'];
    this.targetNetSaleParams['range'] = data['level'] + 2;
    this.targetNetSaleParams[deptId[data['level']]] = [data['showId']];
    this.getTableTreeData(data);
    this.tableTreeService.collapse(array, data, $event);
  }


  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.tasksDuringServiceService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.reachOrderTasksformService.loading = false;
  }
}
