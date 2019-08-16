import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { rangePickerTodayDisabledDate, setFinalFilterData, changeJson, changeJson2, changeJson3 } from '../../../../tools';
import { CommonCustomService } from 'src/app/modules/common-custom/service/common-custom.service';
import { ReachOrderTasksformService } from '../../service/reach-order-tasksform.service';

@Component({
  selector: 'app-reach-order-tasksform',
  templateUrl: './reach-order-tasksform.component.html',
  styleUrls: ['./reach-order-tasksform.component.scss']
})
export class ReachOrderTasksFormComponent implements OnInit, OnDestroy, DoCheck, OnChanges {
  @Output() sendQueryData = new EventEmitter();
  @Input() showSaleCategory = true;  // 是否售后大类
  @Input() showTime: boolean | object = { nzFormat: 'HH:mm' }; // 是否显示时间选择
  timeFormat = 'yyyy-MM-dd  HH:mm';

  private bigType: object = {};


  public loading = false;
  public rangePickerDisabledDate: (current: Date) => void = rangePickerTodayDisabledDate;
  public subscribeAll$: object = {};
  public deptIdOptions: Array<object> = [];  // 部门学院下拉列表
  public paramsAll: object = {};
  public validateForm: FormGroup;
  public bigIdOptions: Array<object> = [];  // 售后大类下拉列表

  constructor(private fb: FormBuilder, public reachOrderTasksformService: ReachOrderTasksformService,
    private commonCustomService: CommonCustomService) { }

  ngOnInit(): void {
    this.initForm();
    this.getDeptQueryByToken();
    this.queryBigType();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.timeFormat = changes.showTime && changes.showTime.currentValue ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
  }
  ngDoCheck() {
    if (this.loading !== this.reachOrderTasksformService.loading) {
      this.loading = this.reachOrderTasksformService.loading;
    }
  }

  /**
   * 查询部门下拉列表
   */
  getDeptQueryByToken() {
    this.subscribeAll$['getDeptQueryByToken$'] = this.reachOrderTasksformService.getDeptQueryByToken().subscribe(res => {
      this.deptIdOptions = changeJson2(res.result);
    });
  }


  /**
   * 获取售后大类
   */
  queryBigType() {
    this.subscribeAll$['queryBigType$'] = this.reachOrderTasksformService.queryBigType().subscribe(res => {
      this.bigIdOptions = changeJson3(res.result);
    });
  }

  deptIdChange(deptId) {
    this.validateForm.get('teacherMAIds').patchValue([]);
    this.validateForm.get('teacherIds').patchValue([]);
    if (!deptId || !deptId.length) {
      this.paramsAll = { deptType: '', queryId: '', userMaIds: [] };
    }

  }
  teacherMAIdsChange(teacherMAIds) {
    this.validateForm.get('teacherIds').patchValue([]);
    this.paramsAll = Object.assign({}, this.paramsAll, { userMaIds: teacherMAIds });

  }

  deptIdSelectionChange(deptId) {
    this.paramsAll['deptType'] = deptId[deptId.length - 1].deptType;
    this.paramsAll['queryId'] = deptId[deptId.length - 1].queryId;
  }

  bigIdChange(bigId) {

  }

  bigIdSelectionChange(bigId) {
    this.bigType['typeCode'] = bigId[bigId.length - 1].typeCode;
    this.bigType['typeId'] = bigId[bigId.length - 1].typeId;
  }




  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    if (!this.showSaleCategory) {
      delete this.validateForm.value['bigId'];
    }
    this.validateForm.value.showTime = this.showTime;
    delete this.paramsAll['userMaIds'];
    delete this.validateForm.value['bigId'];
    delete this.validateForm.value['deptId'];
    const params = setFinalFilterData({ ...this.validateForm.value, ...this.paramsAll, ...this.bigType });
    this.sendQueryData.emit(params);
  }


  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset(this.reachOrderTasksformService.defalutData);
  }




  initForm() {
    const { deptId, teacherMAIds, rangePicker, teacherIds, bigId } = this.reachOrderTasksformService.defalutData;
    this.validateForm = this.fb.group({
      deptId: [deptId],  // 部门
      teacherMAIds: [teacherMAIds],   // 班主任主管
      teacherIds: [teacherIds],  // 班主任
      rangePicker: [rangePicker],  // 日期范围
      bigId: [bigId],  // 售后大类
    });
  }


  ngOnDestroy() {
    this.loading = this.reachOrderTasksformService.loading = false;
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }
}
