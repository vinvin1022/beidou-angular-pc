import { Component, OnInit, Input } from '@angular/core';
import { FlowService } from '../../../service/flow.service';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { GeneralIntroductionAService } from '../../../service/general-introductionA.service';
import { GensearchCriteriaService } from '../../../service/gensearch-criteria.service';

@Component({
  selector: 'app-detail-lista',
  templateUrl: './detailListA.component.html',
  styleUrls: ['./detailListA.component.scss']
})
export class DetailListAComponent implements OnInit {
  @Input() reportDimensionParams = {};
  @Input() flowDataType: String = '电销';
  @Input() rowData: Object = {};
  @Input() filterData;
  public displayData: Array<any> = [];
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public loading: Boolean = false;
  public flowViewReport$;
  public isVisible = false;
  public listDimension: Array<any> = [];
  public listValue: Array<any> = [];
  public widthConfig: Array<string> = [
    '50px', '150px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'];
  public scrollConfig: Object = { x: '6200px', y: '500px' };
  public filterFieldData = {};
  public allChildren = [];
  public fieldKeys: Array<string> = [];
  constructor(private generalIntroductionA: GeneralIntroductionAService, private flowService: FlowService,
    private commonCustomService: CommonCustomService, private gensearchCriteriaService: GensearchCriteriaService) { }

  ngOnInit() {
    this.setWidthScrollConfig();
  }


  pageIndexChange(pageIndex) {
    this.reportDimension();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.reportDimension();
  }
  reportDimension() {
    this.loading = true;
    const params = this._setParams(this.rowData);
    this.generalIntroductionA.getDetailPromoteOverview(params).subscribe(res => {
      const newlist = this.flowService.yingshe(res.result.list || [], this.filterData);
      this.displayData = this.commonCustomService.plusPercentageColomn(newlist, this.generalIntroductionA.plusPercentage);
      this.total = res.result.total;
      this.loading = false;
    });
  }


  setWidthScrollConfig() {
    this.widthConfig = this.commonCustomService.setWidthConfig(this.allChildren.length, ['50px', '150px', '100px']);
    this.scrollConfig = this.commonCustomService.setScrollWidth(this.widthConfig);
  }



  private _setParams(data: object): object {
    this.listDimension = [];
    this.listValue = [];
    const { formData } = this.gensearchCriteriaService;
    const params = {
      dimensionValue: this.rowData['dimensionKey'],
      queryDimension: formData['selectDimensions'][data['level']]['value'],
      groupDimension: formData['selectDimensions'][data['level']]['value'],
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };

    this._getdlist(formData['selectDimensions'], data);
    params['listDimension'] = this.listDimension;
    params['listValue'] = this.listValue;

    return Object.assign({}, this.reportDimensionParams, params);
  }

  private _getdlist(selectDimensions: Array<any>, data: object): void {
    this.listDimension.push(selectDimensions[data['level']]['value']);
    this.listValue.push(data['dimensionKey']);
    if (data['parent']) {
      this._getdlist(selectDimensions, data['parent']);
    }
  }

  showModal(rowData, filterFieldData, allChildren): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.isVisible = true;
    this.rowData = rowData;
    this.filterFieldData = filterFieldData;
    this.allChildren = allChildren;
    this.fieldKeys = Object.keys(this.filterFieldData);
    this.setWidthScrollConfig();
    this.reportDimension();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
