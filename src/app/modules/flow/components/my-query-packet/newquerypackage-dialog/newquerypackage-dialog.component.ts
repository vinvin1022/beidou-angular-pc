import { Component, OnInit, ViewEncapsulation, Input, OnChanges, Output, EventEmitter, SimpleChanges, DoCheck } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { MyquerypacketService } from '../../../service/myquerypacket.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-newquerypackage-dialog',
  templateUrl: './newquerypackage-dialog.component.html',
  styleUrls: ['./newquerypackage-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewquerypackageDialogComponent implements OnInit, OnChanges, DoCheck {
  @Input() title = '新增查询包';
  @Input() rowData: object;
  @Output() createQueryPackage = new EventEmitter();
  public isVisible = false;
  public typeIdValDisabled = false;
  public xtitle = '选中的站点：';

  public validateForm: FormGroup;
  public typeIdValOptions: Array<object> = this.myquerypacketService.typeIdValOptions;
  public accountUidOptions: Array<any> = [];   // 推广账户下拉选项
  public siteNumberOptions: Array<any> = [];   // 推广站点下拉选项

  public siteNumberParams: object = { state: 0 };
  public accountUidFilterData: Array<any> = []; // 选中的推广账户
  public siteNumberFilterData: Array<any> = []; // 选中的推广站点

  public addQueryPackageParams: object = {};
  public checkAllData = {};
  constructor(private fb: FormBuilder, private nzMessage: NzMessageService, public flowcommonform: FlowcommonformService,
    private myquerypacketService: MyquerypacketService) { }


  ngOnInit(): void {
    // this.getQueryAccount();
    // this.getSiteNumberOptions();
    // this._setCheckAll();
    this._initForm();
    this.setXTitel();
  }
  private _initForm() {
    const { packageName, typeIdVal, accountUid, siteNumber } = this.myquerypacketService.dialogDefalutData;
    this.validateForm = this.fb.group({
      packageName: [packageName, [Validators.required]],   // 查询包名称
      typeIdVal: [typeIdVal, [Validators.required]],  // 查询包内容
      accountUid: [accountUid],
      siteNumber: [siteNumber]
    });
  }
  // private _setCheckAll() {
  //   const { accountUid, siteNumber} = this.myquerypacketService.dialogDefalutData;
  //   this.checkAllData = {
  //     accountUid,  // 账户
  //     siteNumber // 站点
  //   };
  // }

  ngOnChanges(inputValue: SimpleChanges) {
    const rowData = inputValue.rowData.currentValue;
    if (rowData) {
      this.title = '编辑查询包';
      this.typeIdValDisabled = true;
      this.validateForm.patchValue({ packageName: rowData['packageName'] });
      this.validateForm.patchValue({ typeIdVal: rowData['typeId'] });

      const typeId = this.validateForm.get('typeIdVal').value;
      const packageValue = rowData['packageValue'].split(',');
      if (typeId === '1') {
        this.validateForm.patchValue({ siteNumber: packageValue });
        // this.checkAllData['siteNumber'] = packageValue;
        this.allsiteChange(packageValue);
      }
      if (typeId === '2') {
        this.validateForm.patchValue({ accountUid: packageValue });
        // this.checkAllData['accountUid'] = packageValue;
        this.allaccountChange(packageValue);

      }
      this.submitForm();
    }
  }
  ngDoCheck() { }

  /**
   * 确认新增查询包
   */
  handleOk() {
    this.submitForm();
    if (this.validateForm.valid) {
      this.setAddQueryPackageParams();
      if (!this.addQueryPackageParams['packageValue']) {
        this.nzMessage.error('必须选择查询包内容！');
        return false;
      }
      if (this.addQueryPackageParams['qid']) {
        this.modQueryPackage();
      } else {
        this.addQueryPackage();
      }
    }

  }
  setXTitel() {
    this.xtitle = this.validateForm.get('typeIdVal').value === '2' ? '选中的账户：' : '选中的站点：';
  }



  /**
   * 设置新增查询包参数
   */
  setAddQueryPackageParams() {
    const mergeParams = Object.assign({}, this.validateForm.value);
    const { packageName, typeIdVal, accountUid, siteNumber } = mergeParams;
    const type = this.typeIdValOptions.find(item => item['typeId'] === typeIdVal);
    if (this.rowData && this.rowData['qid']) {
      this.addQueryPackageParams['qid'] = this.rowData['qid'];
    }
    this.addQueryPackageParams['packageName'] = packageName;
    this.addQueryPackageParams['typeId'] = parseInt(typeIdVal, 10);
    this.addQueryPackageParams['typeName'] = type['typeName'];

    if (typeIdVal === '1') {
      this.addQueryPackageParams['packageValue'] = siteNumber.join(',');
    } else if (typeIdVal === '2') {
      this.addQueryPackageParams['packageValue'] = accountUid.join(',');
    }
  }


  /**
   * 是否关闭新增查询包弹窗
   * @param isShow Boolean 是否关闭新增查询包弹窗
   */
  handleCancel(isShow = false): void {
    this.isVisible = isShow;
    if (!this.isVisible) {
      this.validateForm.reset(this.myquerypacketService.dialogDefalutData);
      // this._setCheckAll();
      this.accountUidFilterData = [];
      this.siteNumberFilterData = [];
    }
  }
  /**
   * 提交表单
   */
  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  /**
   * 新增查询包
   */
  addQueryPackage() {
    this.myquerypacketService.addQueryPackage(this.addQueryPackageParams).subscribe(result => {
      if (result.code === 200) {
        this.nzMessage.success('新增查询包成功！');
        this.createQueryPackage.emit();
        this.handleCancel();
      } else if (result.code === 400) {
        this.nzMessage.error(result.msg);
      } else {
        this.nzMessage.error('新增查询包失败！');
      }
    });
  }
  /**
   * 修改查询包
   */
  modQueryPackage() {
    this.myquerypacketService.modQueryPackage(this.addQueryPackageParams).subscribe(result => {
      if (result.code === 200) {
        this.nzMessage.success('修改查询包成功！');
        this.createQueryPackage.emit();
        this.handleCancel();
      } else {
        this.nzMessage.error('修改查询包失败！');
      }
    });
  }

  typeIdValChange(typeId) {
    this.setXTitel();
  }


  /**
   * 获取推广账户
   */
  getQueryAccount(searchVal = '') {
    this.flowcommonform.getQueryAccount({ searchVal }).subscribe((result) => {
      this.accountUidOptions = result.result;
    });
  }

  /**
   * 获取推广站点
   */
  getSiteNumberOptions(searchVal = '') {
    this.flowcommonform.getSiteNumberOptions({ searchVal }).subscribe(result => {
      this.siteNumberOptions = result.result;
    });
  }


  allaccountChange(data) {
    if (data) {
      this._preparationData(data);
    }
  }

  // accountChange(data) {
  //   if (data) {
  //     this._preparationData(data);
  //   }
  // }


  allsiteChange(data) {
    if (data) {
      this._preparationData(data);
    }
  }
  // siteChange(data) {
  //   if (data) {
  //     this._preparationData(data);
  //   }
  // }

  /**
   * 获取选中推广站点或者推广账户
   * @param data Array
   */
  private _preparationData(data): void {
    let options;
    const typeId = this.validateForm.get('typeIdVal').value;
    if (typeId === '2') {   // 推广账户
      options = this.myquerypacketService.accountUidOptionsAll;
      this.accountUidFilterData = this.formatSelectedData(data, options);
    } else if (typeId === '1') { // 推广站点
      options = this.myquerypacketService.siteNumberOptionsAll;
      this.siteNumberFilterData = this.formatSelectedData(data, options);
    }
  }

  formatSelectedData(data, options): Array<object> {
    const tmpArr = [];
    if ((data && data.length) && (options && options.length)) {
      for (let sidx = 0, len = data.length; sidx < len; sidx++) {
        const sitem = data[sidx];
        for (let index = 0, optionslen = options.length; index < optionslen; index++) {
          const pit = options[index];
          if (sitem.trim() === pit.optionId.trim()) {
            tmpArr.unshift(pit);
          }
        }
      }
    }
    return tmpArr;
  }

  /**
   * 移除右侧数据
   * @param item 移除的项
   */
  remove(item) {
    const tmpArr = [];
    const typeId = this.validateForm.get('typeIdVal').value;

    let selectedFilterData = typeId === '2' ? this.accountUidFilterData : this.siteNumberFilterData;
    selectedFilterData = selectedFilterData.filter((val) => item !== val.optionId);
    // for (let index = 0; index < selectedFilterData.length; index++) {
    //   const ele = selectedFilterData[index];
    //   tmpArr.push(ele.optionId);
    // }
    for (const ele of selectedFilterData) {
      tmpArr.push(ele.optionId);
    }
    if (typeId === '2') {
      this.accountUidFilterData = selectedFilterData;
      this.validateForm.patchValue({ accountUid: tmpArr });
      // this.checkAllData['accountUid'] = tmpArr;
    } else if (typeId === '1') {
      this.siteNumberFilterData = selectedFilterData;
      this.validateForm.patchValue({ siteNumber: tmpArr });
      // this.checkAllData['siteNumber'] = tmpArr;

    }
  }

}
