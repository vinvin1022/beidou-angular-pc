import { Injectable, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Injectable()
export class OperateRoleDialogService {
  public serviceName = 'dms';
  public permissionDescriptions = new Map([
    // tslint:disable-next-line:max-line-length
    [{ optionId: 1, optionName: '流量' }, [{ optionId: 1, optionName: '查看所有流量数据' }, { optionId: 2, optionName: '查看所在中心的权限' }, { optionId: 3, optionName: '查看所在军团权限' }, { optionId: 4, optionName: '查看所在组权限' }, { optionId: 5, optionName: '查看个人流量数据数据' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],
    // tslint:disable-next-line:max-line-length
    [{ optionId: 2, optionName: '网销' }, [{ optionId: 1, optionName: '查看网销所有数据' }, { optionId: 2, optionName: '查看所在事业部权限' }, { optionId: 3, optionName: '查看所在军团权限' }, { optionId: 4, optionName: '查看所在咨询组数据' }, { optionId: 5, optionName: '查看个人数据' }, { optionId: 6, optionName: '查看所在模式的数据' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],
    // tslint:disable-next-line:max-line-length
    [{ optionId: 3, optionName: '中端' }, [{ optionId: 1, optionName: '查看所有中端数据' }, { optionId: 3, optionName: '查看所有军团数据' }, { optionId: 4, optionName: '查看所在组的数据' }, { optionId: 5, optionName: '查看个人数据' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],
    // tslint:disable-next-line:max-line-length
    [{ optionId: 4, optionName: '在线' }, [{ optionId: 1, optionName: '查看所有数据' }, { optionId: 4, optionName: '查看所在组的数据' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],
    // tslint:disable-next-line:max-line-length
    [{ optionId: 5, optionName: '电销' }, [{ optionId: 1, optionName: '查看电销所有数据' }, { optionId: 2, optionName: '查看所在事业部权限' }, { optionId: 3, optionName: '查看所在军团权限' }, { optionId: 4, optionName: '查看所在咨询组数据' }, { optionId: 5, optionName: '查看个人数据' }, { optionId: 6, optionName: '查看所在模式的数据' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],
    // tslint:disable-next-line:max-line-length
    [{ optionId: 6, optionName: '总览' }, [{ optionId: 1, optionName: '查看所有权限' }, { optionId: 2, optionName: '查看所在事业部权限' }, { optionId: 3, optionName: '查看所在军团权限' }, { optionId: 6, optionName: '查看所在模式所有权限' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],
    // tslint:disable-next-line:max-line-length
    [{ optionId: 7, optionName: '网销电销实时' }, [{ optionId: 1, optionName: '查看电销所有数据' }, { optionId: 2, optionName: '查看所在事业部权限' }, { optionId: 3, optionName: '查看所在军团权限' }, { optionId: 6, optionName: '查看所在模式的数据' }, { optionId: 7, optionName: '查看组织架构配置数据权限' }]],

  ]);


  constructor(private requestHttp: RequestService) { }

  /**
   *   查询角色人数列表
   * @param params object  请求参数
   */
  queryPowerUserNum(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/queryPowerUserNum`, params);
  }

  /**
   *   修改角色
   * @param params object  请求参数
   */
  updateRole(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/updateRole`, params);
  }

  /**
   * 添加角色
   * @param params object  请求参数
   */
  saveRole(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/saveRole`, params);
  }

  /**
   * 删除角色
   * @param params object  请求参数
   */
  deleteUserRoleById(params: object = {}) {
    return this.requestHttp.post(`${this.serviceName}/power/manager/deleteUserRoleById`, params);
  }
}



