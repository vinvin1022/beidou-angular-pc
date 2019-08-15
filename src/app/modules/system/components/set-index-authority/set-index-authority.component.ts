
import { Component, OnInit, Output, EventEmitter, DoCheck, OnDestroy, ContentChild, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { _isEmptyObject } from '../../../../tools';
import { NzMessageService } from 'ng-zorro-antd';
import { generalIntroductionACustomFieldData } from 'src/app/modules/flow/service/general-introductionACustomFieldData';
import { releaseMonitoringCustomFieldData } from 'src/app/modules/flow/service/release-monitoringCustomFieldData';
import { CustomColumnDialogService } from 'src/app/modules/common-custom/service/custom-column-dialog.service';
import { netIndexDayFieldData } from 'src/app/modules/front-end/service/net-indexDayFieldData';
import { electricControlDayFieldData } from 'src/app/modules/front-end/service/electric-controlDayFieldData';
import { electricControlWmeekFieldData } from 'src/app/modules/front-end/service/electric-controlWmeekFieldData';
import { armyDataAnalysisCustomFieldData } from 'src/app/modules/front-end/service/army-data-analysisCustomFieldData';
import { onlineStatisticsCustomFieldData } from 'src/app/modules/flow/service/onlineStatisticsCustomFieldData';
import { netStatisticsFieldData } from 'src/app/modules/front-end/service/netStatisticscolFieldData';
import { electricStatisticsFieldData } from 'src/app/modules/front-end/service/electric-statisticsFieldData';
import { armyFlowAnalysisCustomFieldData } from 'src/app/modules/front-end/service/army-flow-analysisCustomFieldData';
import { CommonSettargetService } from '../../service/common-settarget.service';

@Component({
  selector: 'app-set-index-authority',
  templateUrl: './set-index-authority.component.html',
  styleUrls: ['./set-index-authority.component.scss']
})
export class SetIndexAuthorityComponent implements OnInit {
  @Output() sendQueryData = new EventEmitter();
  public roleTypesOptions: object;
  public roleIds: Array<any> = [];
  public radioValuesOptions: Array<any> = [];
  public radioValue: string;
  public customColumn: Object = {};
  public syllable: object = {};
  public customMenu: object = {};
  public validateForm: FormGroup;
  public optionsLoading = false;
  constructor(private fb: FormBuilder, private nzMessage: NzMessageService,
    private commonSettargetService: CommonSettargetService, private customColumnDialogService: CustomColumnDialogService) {
  }

  ngOnInit(): void {
    // this._resetFields();
    this._subscribeUpdateMenuFields();   // 订阅右侧选中的字段
    this.roleTypesOptions = this.commonSettargetService.roleTypesOptions;  // 初始化角色下拉选项
    this._initForm();   // 初始化表单
    this.roleTypeChange();  // 角色改变操作
  }
  goback() {
    history.go(-1);
  }

  private _subscribeUpdateMenuFields() {
    this.commonSettargetService.updateMenuFields.subscribe(res => {
      this.customMenu = res;
    });
  }

  private _setPequestParameter() {
    const params = {};
    const customMenu = this._getSelectedLie();
    params['menuId'] = this.radioValue;
    params['roleId'] = this.validateForm.get('roleId').value;
    params['customMenu'] = JSON.stringify({ 1: customMenu['tmpObj1'], 2: customMenu['tmpObj2'] });
    if (params['roleId'] === null || params['roleId'] === undefined) {
      this.nzMessage.error('请选择角色');
      return false;
    }
    return params;
  }

  submitForm() {
    const params = this._setPequestParameter();
    if (!params) { return false; }
    this.commonSettargetService.saveRoleMenu(params).subscribe(res => {
      if (res.code === 200) {
        this.nzMessage.success('保存成功');
      }
    });
  }


  /**
  * 获取选中的字段
  * @param customMenu object
  */
  private _getSelectedLie() {
    const tmpObj1 = {}, tmpObj2 = {};
    for (const pkey in this.customMenu) {
      if (this.customMenu.hasOwnProperty(pkey)) {
        const pelement = this.customMenu[pkey];
        tmpObj1[pkey] = {}, tmpObj2[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              tmpObj1[pkey][mkey] = tmpObj2[pkey][mkey] = melement;
            } else {
              const tmpArr1 = [], tmpArr2 = [];
              melement.forEach(item => {
                if (item['authorityChecked'] && (item['type'] === '1' || !item['type'])) {
                  tmpArr1.push({ ...item });
                }
                if (item['authorityChecked'] && (item['type'] === '2' || !item['type'])) {
                  tmpArr2.push({ ...item });
                }
              });
              tmpObj1[pkey][mkey] = tmpArr1;
              tmpObj2[pkey][mkey] = tmpArr2;
            }
          }
        }
      }
    }
    return { tmpObj1, tmpObj2 };
  }



  private _initForm() {
    const roleType = this.commonSettargetService.defaultFormData['roleType'];
    const roleId = this.commonSettargetService.defaultFormData['roleId'];
    this.validateForm = this.fb.group({
      roleType: [roleType], // 角色类型
      roleId: [roleId] // 角色名称
    });
  }


  /**
   * 角色change
   * @param val
   */
  roleTypeChange(val?) {
    this.radioValuesOptions = this.commonSettargetService.reportMenus[this.validateForm.get('roleType').value];
    this.radioValue = this.radioValuesOptions[0]['value'];
    this.getKarakters();
  }

  roleIdChange(val?) {
    if (val) { this.getRoleMenuByMenuId(); }
  }

  getRoleMenuByMenuId() {
    const params = {
      'menuId': this.radioValue,
      'roleId': this.validateForm.get('roleId').value,
    };
    if (!params['roleId']) { return; }
    this.commonSettargetService.getRoleMenuByMenuId(params).subscribe(res => {
      let customMenu = {};
      if (res.result && res.result.customMenu) {
        customMenu = JSON.parse(res.result.customMenu);
      }
      const mergeAfterObject = this.combineObject(customMenu['1'], customMenu['2']);
      this.loadDifferentField(mergeAfterObject);
    });
  }

  resetForm() {
    this.loadDifferentField({});
  }


  loadDifferentField(mergeAfterObject) {
    let customFieldData = {};
    switch (this.radioValue) {
      case 'generalIntroductionA':    // 推广总览
        // this.generalIntroductionACustomFieldData = this.customColumnDialogService.resetColumnData(generalIntroductionACustomFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(generalIntroductionACustomFieldData);
        break;
      case 'releaseMonitoring':   // 投放监控
        // this.releaseMonitoringCustomFieldData = this.customColumnDialogService.resetColumnData(releaseMonitoringCustomFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(releaseMonitoringCustomFieldData);
        break;
      case 'onlineStatistics':   // 在线统计
        // this.onlineStatisticsCustomFieldData = this.customColumnDialogService.resetColumnData(onlineStatisticsCustomFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(onlineStatisticsCustomFieldData);
        break;
      case 'netIndex':    // 网销效率指标统计
        // this.netIndexDayFieldData = this.customColumnDialogService.resetColumnData(netIndexDayFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(netIndexDayFieldData);
        break;
      case 'netStatistics':   // 网销项目指标统计
        // this.netStatisticsFieldData = this.customColumnDialogService.resetColumnData(netStatisticsFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(netStatisticsFieldData);
        break;

      case 'electricControlday':   // 电销效率指标统计日表
        // this.electricControlDayFieldData = this.customColumnDialogService.resetColumnData(electricControlDayFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(electricControlDayFieldData);
        break;

      case 'electricControlmonth':  // 电销效率指标统计周月表
        // this.electricControlWmeekFieldData = this.customColumnDialogService.resetColumnData(electricControlWmeekFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(electricControlWmeekFieldData);
        break;
      case 'electricStatistics':  // 电销项目指标统计
        // this.electricStatisticsFieldData = this.customColumnDialogService.resetColumnData(electricStatisticsFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(electricStatisticsFieldData);
        break;
      case 'armyDataAnalysis':  // 中端军团数据分析
        // this.armyDataAnalysisCustomFieldData = this.customColumnDialogService.resetColumnData(armyDataAnalysisCustomFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(armyDataAnalysisCustomFieldData);
        break;

      case 'armyFlowAnalysis':  // 中端军团流量分析
        // this.armyFlowAnalysisCustomFieldData = this.customColumnDialogService.resetColumnData(armyFlowAnalysisCustomFieldData);
        customFieldData = this.customColumnDialogService.resetColumnData(armyFlowAnalysisCustomFieldData);
        break;
      default:
        break;
    }
    this.customMenu = this.syllable = this.finallyField(mergeAfterObject, customFieldData);
  }


  finallyField(mergeAfterObject, contrastField) {
    const newContrastField = { ...mergeAfterObject, ...contrastField };
    if (_isEmptyObject(mergeAfterObject)) {
      return contrastField;
    }
    for (const key in newContrastField) {
      if (newContrastField.hasOwnProperty(key)) {
        const element = newContrastField[key];
        for (const skey in mergeAfterObject) {
          if (mergeAfterObject.hasOwnProperty(skey)) {
            const selement = mergeAfterObject[skey];
            if (key === skey) {
              for (const zkey in element) {
                if (element.hasOwnProperty(zkey)) {
                  const zelement = selement[zkey];
                  if (zkey === 'children') {
                    selement[zkey].forEach((citem, sindex) => {
                      element[zkey].forEach((bitem, bindex) => {
                        if (citem['label'] === bitem['label']) {
                          element[zkey].splice(bindex, 1, citem);
                        }
                      });
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    for (const key in newContrastField) {
      if (newContrastField.hasOwnProperty(key)) {
        if (newContrastField[key].children.every(item => item.authorityChecked === false)) {
          newContrastField[key].allChecked = false;
          newContrastField[key].indeterminate = false;
        } else if (newContrastField[key].children.every(item => item.authorityChecked === true)) {
          newContrastField[key].allChecked = true;
          newContrastField[key].indeterminate = false;
         } else if (newContrastField[key].children.some(item => item.authorityChecked === true)) {
          newContrastField[key].allChecked = false;
          newContrastField[key].indeterminate = true;
        } else {
          newContrastField[key].allChecked = false;
          newContrastField[key].indeterminate = false;
        }
      }
    }
    return newContrastField;
  }

  /**
   * 合并对象
   * @param customMenu1 object
   * @param customMenu2 object
   */
  private combineObject(customMenu1: object, customMenu2: object) {
    const tmp = {};
    for (const key in customMenu1) {
      if (customMenu1.hasOwnProperty(key)) {
        for (const skey in customMenu2) {
          if (customMenu2.hasOwnProperty(skey)) {
            if (key === skey) {
              const children = this._arrayObjectDeweight(customMenu1[key].children.concat(customMenu2[skey].children));
              tmp[key] = Object.assign({}, customMenu1[key], customMenu2[skey]);
              tmp[key].children = children;
            }
          }
        }
      }
    }
    return tmp;
  }

  /**
   * 数组对象去重
   * @param children Array<any>
   */
  private _arrayObjectDeweight(children: Array<any>) {
    let newChildren = [...children];
    const res = new Map();
    newChildren = newChildren.filter((item) => !res.has(item.label) && res.set(item.label, 1));
    return newChildren;
  }

  radioValueChange(val?) {
    if (val) { this.getRoleMenuByMenuId(); }
  }

  getKarakters() {
    this.commonSettargetService.getRoleByRoleType({ roleType: this.validateForm.get('roleType').value }).subscribe(res => {
      this.roleIds = res.result;
      if (res.result[0]) {
        this.validateForm.patchValue({ roleId: res.result[0].roleId });
      }
    });
  }

}


