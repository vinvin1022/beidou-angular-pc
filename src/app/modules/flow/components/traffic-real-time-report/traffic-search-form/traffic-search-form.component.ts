import {
  Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, OnDestroy, DoCheck,
  TemplateRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TrafficSearchFormService } from '../../../service/traffic-search-form.service';
import { FlowcommonformService } from '../../../service/flowcommonform.service';
import { GensearchCriteriaService } from '../../../service/gensearch-criteria.service';
import { setFinalFilterData } from 'src/app/tools';


@Component({
  selector: 'app-traffic-search-form',
  templateUrl: './traffic-search-form.component.html',
  styleUrls: ['./traffic-search-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrafficSearchFormComponent implements OnInit, OnDestroy {
  @ViewChild('formtitle', { static: false }) formtitle: TemplateRef<any>;
  @Output() sendQueryData = new EventEmitter<any>();

  public isSubmit = true;

  public validateForm: FormGroup;
  public loading = false;
  public paramsAll = {};


  constructor(private fb: FormBuilder, public trafficSearchFormService: TrafficSearchFormService, public flowcommonform: FlowcommonformService,
    public gensearchCriteriaService: GensearchCriteriaService) { }

  /**
   * 重置数据
   * @param e MouseEvent
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.isSubmit = false;
    this.validateForm.reset(this.trafficSearchFormService.defaultFormData);
    this.markAsPristineFrom();
  }



  submitForm(): boolean {
    this.isSubmit = true;
    this.markAsPristineFrom();
    const formData = setFinalFilterData(this.validateForm.value);
    this.sendQueryData.emit({ ...formData });
    return true;
  }


  ngOnInit(): void {
    this.initForm();
  }

  /**
   * form初始化
   */
  markAsPristineFrom() {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }
  /**
   * 初始化表单
   */
  initForm() {
    const { dept1List, dept2List, userList, divisionList, advertisersTypeList, advertisersNameList } = this.trafficSearchFormService.defaultFormData;
    this.validateForm = this.fb.group({
      dept1List: [dept1List],   // 流量军团
      dept2List: [dept2List],  // 流量组
      userList: [userList],  // 流量人员
      divisionList: [divisionList],   // 事业部
      advertisersTypeList: [advertisersTypeList],  // 推广方式
      advertisersNameList: [advertisersNameList],   // 推广渠道
    });
  }


  alluserListChange(val) {
    this._setAssociationParams();
  }

  alldept1ListChange(val) {
    const { dept2List, userList } = this.trafficSearchFormService.defaultFormData;
    this.validateForm.patchValue({ dept2List, userList });
    this._setAssociationParams();
  }

  alldept2ListChange(val) {
    const { userList } = this.trafficSearchFormService.defaultFormData;
    this.validateForm.patchValue({ userList });
    this._setAssociationParams();
  }


  private _setAssociationParams() {
    this.paramsAll = setFinalFilterData(this.validateForm.value);
  }


  /**
   * 设置最终选择的form数据
   */
  setSelectedData() {
    const paramsData: object = {};
    const mergeParams = Object.assign({}, this.validateForm.value);
    Object.keys(mergeParams).forEach((value) => {
      if (mergeParams[value]) {
        if (value === 'advertisersTypeList') {
          if (mergeParams[value] === '全部') {
            paramsData[value] = [];
          } else if (typeof mergeParams[value] === 'string') {
            paramsData[value] = [mergeParams[value]];
          }
        } else {
          paramsData[value] = mergeParams[value];
        }
      }
    });
    return paramsData;
  }


  ngOnDestroy() {
    this.loading = this.trafficSearchFormService.loading = false;
  }
}
