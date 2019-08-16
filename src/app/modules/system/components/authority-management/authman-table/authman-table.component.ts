import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { AuthmanTableService } from '../../../service/authman-table.service';
import { NzMessageService } from 'ng-zorro-antd';
import { OperateRoleDialogComponent } from '../operate-role-dialog/operate-role-dialog.component';
import { AuthSeachformService } from '../../../service/auth-seachform.service';

@Component({
  selector: 'app-authman-table',
  templateUrl: './authman-table.component.html',
  styleUrls: ['./authman-table.component.scss']
})
export class AuthmanTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() searchData = {};
  @ViewChild('operateRoleDialog', { static: false }) operateRoleDialog: OperateRoleDialogComponent;
  public userRoleParams: object = {};
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 1;
  public subscribeAll$: object = {};

  public displayData = [];


  constructor(private authmanTableService: AuthmanTableService,
    private authSeachformService: AuthSeachformService, private message: NzMessageService,
    private commonCustomService: CommonCustomService) { }


  ngOnInit() {
    // this.getFormData();
    // this.queryPowerUserNum();
  }
  ngOnChanges() {
    this.userRoleParams = this.searchData || {};
    this.queryPowerUserNum();
  }

  // getFormData() {
  //   this.authSeachformService.subscribMessage().subscribe(res => {
  //     this.userRoleParams = res;
  //     this.queryPowerUserNum();
  //   });
  // }

  pageIndexChange(pageIndex) {
    this.queryPowerUserNum();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.queryPowerUserNum();
  }

  /**
   * 设置查询参数
   */
  setUserRoleParams() {
    this.userRoleParams['pageNo'] = this.pageIndex;
    this.userRoleParams['pageSize'] = this.pageSize;
  }

  /**
   * 获取表格数据
   */
  queryPowerUserNum() {
    this.loading = this.authSeachformService.loading = true;
    this.setUserRoleParams();
    this.subscribeAll$['queryPowerUserNum$'] = this.authmanTableService.queryPowerUserNum(this.userRoleParams).subscribe(res => {
      this.displayData = res.result.list;
      this.total = res.result.total;
      this.loading = this.authSeachformService.loading = false;
    }, () => {
      this.loading = this.authSeachformService.loading = false;
    });
  }


  deleteUserRoleById(roleId) {
    this.subscribeAll$['deleteUserRoleById$'] = this.authmanTableService.deleteUserRoleById({ roleId }).subscribe(res => {
      if (res.code === 200) {
        this.message.success(res.result);
        this.queryPowerUserNum();
      } else {
        this.message.error('删除失败！');
      }
    });
  }

  editUserRole(rowData) {
    this.operateRoleDialog.showModal(rowData);
  }

  freshen() {
    this.queryPowerUserNum();
  }

  createRole(): void {
    this.operateRoleDialog.showModal();
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);

  }

}
