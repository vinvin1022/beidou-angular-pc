import { Component, OnInit, Output, EventEmitter, DoCheck, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExpansionDerivationService } from '../../../service/expansion-derivation.service';
import { formatDate, rangePickerTodayDisabledDate } from '../../../../../tools';

@Component({
  selector: 'app-subderivation-paration',
  templateUrl: './subderivation-paration.component.html',
  styleUrls: ['./subderivation-paration.component.scss']
})
export class SubderivationParationComponent implements OnInit, DoCheck {
  @Output() sendQueryData = new EventEmitter();

  public channelNoOptions: Array<object> = [];
  public rangePickerDisabledDate: (current: Date) => void = rangePickerTodayDisabledDate;
  public validateForm: FormGroup;
  public loading = false;
  public optionsLoading = false;

  constructor(private fb: FormBuilder,
    private expansionDerivationService: ExpansionDerivationService) {
  }


  openCodeChange(isOpen) {
    if (!this.channelNoOptions.length && isOpen) {
      this.getCodeOptions();
    }
  }
  // 推广渠道
  getCodeOptions(): void {
    this.optionsLoading = true;
    this.expansionDerivationService.selectChannelByConditions().subscribe(res => {
      this.optionsLoading = false;
      this.channelNoOptions = res.data.filter(item => item.channelType === 1).map(item => {
        item['value'] = item && item.channelNo;
        item['label'] = item && item.channelName;
        return item;
      });
    });
  }

  rangePickerChange(rangePicker) { }


  ngOnInit(): void {
    const channelNoList = this.expansionDerivationService.defaultFormData['channelNoList'];
    const rangePicker = this.expansionDerivationService.defaultFormData['rangePicker'];
    this.validateForm = this.fb.group({
      channelNoList: [channelNoList], // 推广渠道
      rangePicker: [rangePicker] // 推广日期
    });
  }

  ngDoCheck() {
    if (this.loading !== this.expansionDerivationService.loading) {
      this.loading = this.expansionDerivationService.loading;
    }
  }
  // 提交表单
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const formValue = this.validateForm.value;
    formValue['startDate'] = formatDate(formValue['rangePicker'][0], 'yyyy-MM-dd');
    formValue['endDate'] = formatDate(formValue['rangePicker'][1], 'yyyy-MM-dd');
    delete formValue['rangePicker'];
    if (this.validateForm.value.channelNoList[0] === '全部') {
      this.validateForm.value.channelNoList = [];
    }

    this.sendQueryData.emit(formValue);
  }
  // 重置表单
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset(this.expansionDerivationService.defaultFormData);
  }

}
