import { Component, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';

import { NzMessageService, NzFormatEmitEvent } from 'ng-zorro-antd';
import { AuthSeachformService } from '../../../service/auth-seachform.service';
import { CtrlUpermissionDialogComponent } from '../ctrl-upermission-dialog/ctrl-upermission-dialog.component';
import { UserPermissionTableService } from '../../../service/user-permission-table.service';



@Component({
  selector: 'app-user-permission-table',
  templateUrl: './user-permission-table.component.html',
  styleUrls: ['./user-permission-table.component.scss']
})
export class UserPermissionTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() searchData = {};
  @ViewChild('ctrlUpermissionDialog', {static: false}) ctrlUpermissionDialog: CtrlUpermissionDialogComponent;
  public userRoleParams: Object = {};
  public loading: Boolean = false;
  public pageIndex: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 1;
  public subscribeAll$: Object = {};
  public displayData = [];
  public visible = false;
  public treeNodes: Array<any> = [];
  public currentRowData: Object = {};
  public defaultCheckedKeys: Array<any> = [];
  public checkData = {};
  private saveUserDateParams: Object = {
    keys: [], center: [], legion: [], group: []
  };



  constructor(private userPermissionTableService: UserPermissionTableService,
    private authSeachformService: AuthSeachformService, private message: NzMessageService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit() {
    // this.getFormData();
    this.queryDeptTeam();
  }

  ngOnChanges() {
    this.userRoleParams = this.searchData || {};
    this.queryUserRole();
  }
  // getFormData() {
  //   this.authSeachformService.subscribMessage().subscribe(res => {
  //     this.userRoleParams = res;
  //     this.queryUserRole();
  //   });
  // }

  pageIndexChange(pageIndex) {
    this.queryUserRole();
  }
  pageSizeChange(pageSize) {
    this.pageIndex = 1;
    this.queryUserRole();
  }

  /**
  * 设置查询参数
  */
  setQueryUserRoleParams() {
    this.userRoleParams['pageNo'] = this.pageIndex;
    this.userRoleParams['pageSize'] = this.pageSize;
  }

  /**
   * 获取表格数据
   */
  queryUserRole() {
    this.loading = this.authSeachformService.loading = true;
    this.setQueryUserRoleParams();
    this.subscribeAll$['queryUserRole$'] = this.userPermissionTableService.queryUserRole(this.userRoleParams).subscribe(res => {
      this.displayData = res.result.list;
      this.total = res.result.total;
      this.loading = this.authSeachformService.loading = false;
    }, () => {
      this.loading = this.authSeachformService.loading = false;
    });
  }


  deleteUserRole(id) {
    this.subscribeAll$['deleteUserRole$'] = this.userPermissionTableService.deleteUserRole({ id }).subscribe(res => {
      if (res.code === 200) {
        this.pageIndex = 1;
        this.message.success(res.result);
        this.queryUserRole();
      } else {
        this.message.error('删除失败！');
      }
    });
  }

  editUserRole(rowData) {
    this.ctrlUpermissionDialog.showModal(rowData);
  }

  freshen() {
    this.pageIndex = 1;
    this.queryUserRole();
  }

  createRole(): void {
    this.ctrlUpermissionDialog.showModal();
  }

  /**
   * 获取组织架构
   */
  queryDeptTeam() {
    this.subscribeAll$['queryDeptTeam$'] = this.userPermissionTableService.queryDeptTeam().subscribe(res => {
      this.treeNodes = res.result;
    });
  }

  showOrganizational(item) {
    this.currentRowData = item;
    this.visible = true;
    this.subscribeAll$['getUserDateVOByUserId$'] = this.userPermissionTableService.getUserDateVOByUserId({ userId: item.userId }).subscribe(res => {
      this.defaultCheckedKeys = (res.result && res.result.keys) || [];
      this.saveUserDateParams = res.result;
    });
  }


  getSaveUserDateParams(data) {
    this.checkData = data;
    this.setSaveUserDateParams();
  }

  setSaveUserDateParams() {
    if (this.checkData['eventName'] === 'check') {
      this.saveUserDateParams = { keys: [], center: [], legion: [], group: [] };
      const types = { 1: 'center', 2: 'legion', 3: 'group' };
      for (const iterator of this.checkData['nodes']) {
        if (iterator.level === 0) {
          this.saveUserDateParams['keys'].push(iterator.origin.key);
          for (const subItem of iterator.children) {
            this.saveUserDateParams[types[subItem.origin.range]].push(subItem.origin.deptId);
            this.saveUserDateParams['keys'].push(subItem.origin.key);
          }
        } else {
          this.saveUserDateParams[types[iterator.origin.range]].push(iterator.origin.deptId);
          this.saveUserDateParams['keys'].push(iterator.origin.key);
        }
      }
    }
  }
  submit() {
    this.saveUserDateParams['userId'] = this.currentRowData['userId'];
    this.subscribeAll$['saveUserDate$'] = this.userPermissionTableService.saveUserDate(this.saveUserDateParams).subscribe(res => {
      if (res.code === 200) {
        this.message.success(res.result);
        this.close();
      } else {
        this.message.warning('设置失败');
      }
    });
  }
  close(): void {
    this.visible = false;
  }

  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }

}
