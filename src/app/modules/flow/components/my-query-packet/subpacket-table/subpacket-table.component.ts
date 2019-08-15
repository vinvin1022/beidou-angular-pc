import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, DoCheck } from '@angular/core';
import { NewquerypackageDialogComponent } from '../newquerypackage-dialog/newquerypackage-dialog.component';
import { MyquerypacketService } from '../../../service/myquerypacket.service';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-subpacket-table',
  templateUrl: './subpacket-table.component.html',
  styleUrls: ['./subpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubpacketTableComponent implements OnInit, OnChanges, DoCheck {
  @ViewChild('nzTable', { static: false }) overviewTableData: ElementRef;
  @Input() filterData: Object;
  @Input() editBtnVal;
  @Input() delBtnVal;
  @ViewChild('newquerypackageDialog', { static: false }) newquerypackageDialog: NewquerypackageDialogComponent;
  public tableData = [];
  public pageSizeList = [10, 20, 30, 40, 50];
  public pageNo = this.myquerypacketService.defalutData.pageNo;
  public pageSize = this.myquerypacketService.defalutData.pageSize;
  public total: Number = 0;
  public loading = this.myquerypacketService.loading;
  public rowData; // 行数据


  constructor(private myquerypacketService: MyquerypacketService, private nzMessage: NzMessageService) { }


  pageNoChange(pageNo) {
    this.myquerypacketService.finallyParams['pageNo'] = this.pageNo = pageNo;
    this.myquerypacketService._setTableData();
  }
  pageSizeChange(pageSize) {
    const { pageNo } = this.myquerypacketService.defalutData;
    this.initPageData(pageNo, pageSize);
    this.myquerypacketService._setTableData();

  }
  ngOnChanges() {
    if (this.filterData) {
      this.myquerypacketService.finallyParams = this.filterData;
      const { pageNo, pageSize } = this.myquerypacketService.defalutData;
      this.initPageData(pageNo, pageSize);
      this.myquerypacketService._setTableData();
    }
  }
  ngOnInit() {
    const { pageNo, pageSize, typeId } = this.myquerypacketService.defalutData;
    this.initPageData(pageNo, pageSize);
    this.myquerypacketService.finallyParams['typeId'] = typeId;
    this.myquerypacketService._setTableData();
  }
  ngDoCheck() {
    if (this.myquerypacketService.queryPackageFlag) {  // 只有queryPackageFlag为true时才执行DoCheck
      this.tableData = this.myquerypacketService.tableData;
      this.total = this.myquerypacketService.total;
      this.initPageData(this.myquerypacketService.finallyParams['pageNo'], this.myquerypacketService.finallyParams['pageSize']);
      this.myquerypacketService.queryPackageFlag = false;
    }
  }


  /**
   * 初始化分页数据
   * @param pageNo Number 页码
   * @param pageSize Number 每页显示条数
   */
  initPageData(pageNo, pageSize) {
    this.pageNo = this.myquerypacketService.finallyParams['pageNo'] = pageNo;
    this.pageSize = this.myquerypacketService.finallyParams['pageSize'] = pageSize;
  }

  /**
   * 获取查询包
   */
  getQueryPackage(params) {
    this.myquerypacketService.getQueryPackage(params).subscribe(result => {

    });
  }

  /**
   * 打开新增查询包
   */
  showQuerypackageDialog() {
    this.newquerypackageDialog.handleCancel(true);
  }

  /**
   * 编辑查询包
   */
  editQueryPacket(qid) {
    const newRowData = this.filterRowData(qid);
    newRowData.timestamp = new Date().getTime();
    newRowData['typeId'] = newRowData['typeName'] === '推广账户' ? '2' : '1';
    this.rowData = { ...newRowData };
    this.showQuerypackageDialog();
  }


  /**
   * 删除查询包
   * @param qid
   */
  deleteQueryPacket(qid) {
    const params = this.filterRowData(qid);
    this.myquerypacketService.delQueryPackage(params).subscribe(result => {
      if (result.code === 200) {
        this.nzMessage.success('删除查询包成功');
        const { pageNo, pageSize } = this.myquerypacketService.defalutData;
        this.initPageData(pageNo, pageSize);
        this.myquerypacketService._setTableData();
      }
    });
  }

  filterRowData(qid) {
    const params = this.tableData.find(item => item.qid === qid);
    return params;
  }

  /**
   * 编辑之后刷新表格
   * @param data
   */
  refreshTable(data) {
    // const {pageNo, pageSize, typeId} =  this.myquerypacketService.defalutData;
    // this.myquerypacketService.finallyParams = this.filterData;
    // this.initPageData(pageNo, pageSize);
    // this.myquerypacketService.finallyParams['typeId'] = typeId;
    this.myquerypacketService._setTableData();
  }
}

