import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { TableTreeService } from 'src/app/service/table-tree.service';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { FrontRealFormService } from '../../../service/front-real-form.service';
import { EffectivenessService } from '../../../service/effectiveness.service';
import { ActivatedRoute } from '@angular/router';
import { effectivenessFieldData } from '../../../service/effectivenessFieldData';


@Component({
  selector: 'app-subeffective-table',
  templateUrl: './subeffective-table.component.html',
  styleUrls: ['./subeffective-table.component.scss']
})
export class SubeffectiveTableComponent implements OnInit, OnChanges, OnDestroy {
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
  public tableTitle: Object = { 1: '分配时效', 2: '拨打时效' };
  public queryAlType;


  tableTreeData = [];
  expandDataCache = {};
  constructor(private effectivenessService: EffectivenessService, private frontRealFormService: FrontRealFormService,
    private customColumnDialogService: CustomColumnDialogService, private activatedRoute: ActivatedRoute,
    private commonCustomService: CommonCustomService, private tableTreeService: TableTreeService) { }

  ngOnChanges() {
    if (this.filterData) {
      this.getDivisonNetSaleData();
    }
  }
  ngOnInit() {
    this.setWidthScrollConfig();
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.queryAlType = params.get('queryAlType');
    });
  }
  /**
  * 获取自定义列过滤数据
  * @param data
  */
  getFilterField() {
    const newData = this.customColumnDialogService.filterSelectColoumn(effectivenessFieldData);
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
    this.targetNetSaleParams['queryAlType'] = this.queryAlType;
  }



  /**
   * 实时导出
   */
  exportsFile() {
    this.exportsParams['range'] = 5;
    this.effectivenessService.savefrontACTQueryVO(this.exportsParams).subscribe(res => {
      this.effectivenessService.exportFrontACT({ ridesKey: res.result });
    });
  }





  /**
   * 获取表格合计数据
   */
  getDivisonNetSaleData() {
    this.loading = this.frontRealFormService.loading = true;
    this.setTargetNetSaleParams();
    this.subscribeAll$['queryFrontACTALS$'] = this.effectivenessService.queryFrontACTALS(this.targetNetSaleParams)
      .subscribe(res => {
        this.tableTreeData = this.tableTreeService.createTableTreeChildren(res.result);
        this.initTreeTable();
        this.loading = this.frontRealFormService.loading = false;
        this.getFilterField();
      }, () => {
        this.loading = this.frontRealFormService.loading = false;
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
      this.loading = this.frontRealFormService.loading = true;
      this.subscribeAll$['queryFrontACTALS$'] = this.effectivenessService.queryFrontACTALS(params).subscribe(res => {
        this.tableTreeData = this.tableTreeService.assemblyChildren(this.tableTreeData, data, res.result);
        this.initTreeTable(data);
        this.loading = this.frontRealFormService.loading = false;
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
    const deptId = ['dept0', 'dept', 'legion', 'group', 'userId'];
    this.targetNetSaleParams['queryAlType'] = this.queryAlType;
    this.targetNetSaleParams['range'] = data['level'] + 2;
    this.targetNetSaleParams[deptId[data['level']]] = [data[`deptId${data['level']}`]];
    this.getTableTreeData(data);
    this.tableTreeService.collapse(array, data, $event);
  }

  /**
   * 格式化表格树
   */
  initTreeTable(data = {}): void {
    const { plusPercentage } = this.effectivenessService;
    this.tableTreeData.forEach(item => {
      this.expandDataCache[item.key] = this.tableTreeService.convertTreeToList(item, plusPercentage);
    });
    this.expandDataCache = this.tableTreeService.formateTableTree(data, this.expandDataCache);
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
    this.frontRealFormService.loading = false;
  }
}
