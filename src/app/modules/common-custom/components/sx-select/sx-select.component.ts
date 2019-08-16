import { Component, OnInit, Input, OnChanges, ViewChild, TemplateRef, EventEmitter, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonCustomService } from '../../service/common-custom.service';
import { SelectAllService } from 'src/app/service/select-all.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sx-select',
  templateUrl: './sx-select.component.html',
  styleUrls: ['./sx-select.component.scss']
})
export class SxSelectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectGroup;
  @Input() label;
  @Input() bdFormControlName;
  @Input() bdLabelWidth = 'width85';

  @Input() bdRequired = false;   // 是否为必填
  @Input() @ViewChild('checkBoxRender', { static: false }) checkBoxRenderX: TemplateRef<any>;
  @Input() optionsService: object;  // 获取下拉选项的服务名称   bdServerSearch为true时必传
  @Input() methodName = 'a';    // 获取下拉选项的结构  bdServerSearch为true时必传
  @Input() requestParams: object = {};  // 获取下拉选项的请求参数
  @Input() bdDisabled = false;  // 是否禁用select
  @Input() bdServerSearch = true;  // 是否远程搜索
  @Input() bdPlaceHolder = '请选择';  // 没有值时候的显示文字
  @Input() optionsLoading = false;  // 下拉选项是否正在加载中
  @Input() selectedValue: Array<string> = [];  // 选中的值
  @Input() storeOptionsData = [];             // 下拉选项的值  bdServerSearch为false时必传
  @Input() bdMode = 'multiple';    // 下拉选项的模式  单选或者多选
  @Input() isShowAll = false;    // 是否显示全部选项
  @Input() defaultLoad = false;
  @Input() bdAllowClear = true;  // 是否支持清除
  @Output() selectedValueChange = new EventEmitter();  // 选中改变事件
  @Output() bdOpenChange = new EventEmitter();    // 下拉选项打开或者关闭事件
  @Output() bdOnSearch = new EventEmitter();     // 搜索事件
  @Output() bdIsAllcheckedChange = new EventEmitter();  // 全选事件

  public subscribeAll$: object = {};
  public isAllchecked = false;
  public optionsData: Array<any> = [];
  public subject = new Subject();

  private paramsFlag = true;

  constructor(private commonCustomService: CommonCustomService, private selectAllService: SelectAllService) { }

  ngOnInit() {
    this.optionsData = [...this.storeOptionsData];
    this.searchOptions();
    if (this.defaultLoad) {
      this.openOptionsChange(true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestParams) {
      this.paramsFlag = changes.requestParams.firstChange;
    }
  }



  /**
   * 下拉列表打开关闭事件
   */
  openOptionsChange(isOpen: boolean) {
    if (isOpen) {
      if (this.bdServerSearch) {   // 如果是远程搜索
        // if (!this.storeOptionsData.length || (this.requestParams && Object.keys(this.requestParams).length)) {
        //   this.getOptionsData();
        // }

        if (!this.storeOptionsData.length || !this.paramsFlag) {
          this.getOptionsData();
        }
      } else {
        this.selectAllService.optionsData = this.storeOptionsData = [...this.optionsData];
        if (this.checkBoxRenderX) {
          // this.isAllchecked = this._autoSelectedCheck(this.selectedValue);
          this.isAllchecked = this._autoSelectedCheck(this.selectGroup.get(this.bdFormControlName).value);
        }
      }
    }
    this.bdOpenChange.emit(isOpen);
  }

  /**
   * 获取下拉列表
   * @param searchVal string 查询参数
   */
  getOptionsData(searchVal?: string) {
    if (this.optionsService && this.bdServerSearch) {
      this.optionsLoading = true;
      const requestParams = { searchVal, ...this.requestParams };
      this.subscribeAll$[`${this.methodName}$`] = this.optionsService[this.methodName](requestParams)
        .subscribe(res => {
          let data = res.result || res.data || [];
          data = data.filter(item => item);
          let filterData = [];
          if (data && Array.isArray(data)) {
            data.map(fitem => {
              if (Object.keys(fitem).includes('userId')) {
                fitem['optionId'] = fitem['userId'];
                fitem['optionName'] = fitem['userName'];
              }
              if (Object.keys(fitem).includes('roleId')) {
                fitem['optionId'] = fitem['roleId'];
                fitem['optionName'] = fitem['roleName'];
              }
              return fitem;
            });
            filterData = data.filter(item => item['optionId'] && item['optionName']);
            this.selectAllService.optionsData = this.storeOptionsData = filterData;
            // this.selectedValue = this.storeOptionsData[0]['optionId'];
          } else {
            this.selectAllService.optionsData = this.storeOptionsData = [];
          }
          this.optionsLoading = false;
          if (this.checkBoxRenderX) {
            // this.isAllchecked = this.storeOptionsData.length ? this._autoSelectedCheck(this.selectedValue) : false;
            this.isAllchecked = this.storeOptionsData.length ?
              this._autoSelectedCheck(this.selectGroup.get(this.bdFormControlName).value) : false;
          }
        });
    }
  }

  searchOptions() {
    this.subject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(searchVal => {
      if (this.bdServerSearch) {
        this.getOptionsData(searchVal as string);
      } else {
        this.storeOptionsData = [...this.optionsData];
        if (searchVal) {
          this.storeOptionsData = [...this.storeOptionsData.filter(item => item['optionName'].indexOf(searchVal) >= 0)];
          if (this.checkBoxRenderX) {
            // this.isAllchecked = this.storeOptionsData.length ? this._autoSelectedCheck(this.selectedValue) : false;
            this.isAllchecked = this.storeOptionsData.length ?
              this._autoSelectedCheck(this.selectGroup.get(this.bdFormControlName).value) : false;
          }
        } else {
          if (this.checkBoxRenderX) {
            // this.isAllchecked = this._autoSelectedCheck(this.selectedValue);
            this.isAllchecked = this._autoSelectedCheck(this.selectGroup.get(this.bdFormControlName).value);
          }
        }
      }
    });
  }

  /**
   * 值变化事件
   * @param val any
   */
  optionsChange(val) {
    if (this.checkBoxRenderX) {
      this.isAllchecked = this._autoSelectedCheck(val);
    }
    // this.selectedValue = val;
    this.selectedValueChange.emit(val);
  }

  /**
   * 勾选变化事件
   * @param isSelect boolean 是否勾选
   */
  isAllcheckedChange(isSelect: boolean) {
    if (isSelect) {
      const tmpArr = [];
      this.storeOptionsData.forEach((item) => {
        tmpArr.push(item.optionId);
      });
      // this.selectedValue = Array.from(new Set([...(this.selectedValue || []), ...tmpArr]));
      const newSelectedValue = Array.from(new Set([...(this.selectGroup.get(this.bdFormControlName).value || []), ...tmpArr]));
      this.selectGroup.patchValue({ [this.bdFormControlName]: newSelectedValue });
    } else {
      this.storeOptionsData.forEach(item => {
        // this.selectedValue = this.selectedValue.filter((sitem) => {
        //   return item['optionId'] !== sitem;
        // });
        const newSelectedValue = this.selectGroup.get(this.bdFormControlName).value.filter((sitem) => {
          return item['optionId'] !== sitem;
        });

        this.selectGroup.patchValue({ [this.bdFormControlName]: newSelectedValue });
      });
    }
    this.bdIsAllcheckedChange.emit(isSelect);
    this.selectedValueChange.emit(this.selectGroup.get(this.bdFormControlName).value);
  }

  /**
   * 自动选中checkbox
   * @param val Array<string>
   */
  private _autoSelectedCheck(val: string[] = []): boolean {
    if (val && val.length) {
      let num = 0;
      // for (let index = 0; index < this.storeOptionsData.length; index++) {
      //   const item = this.storeOptionsData[index];
      //   if (val.includes(item['optionId'])) {
      //     num++;
      //   }
      // }

      for (const item of this.storeOptionsData) {
        if (val.includes(item['optionId'])) {
          num++;
        }
      }

      return num === this.storeOptionsData.length ? true : false;
    }
    return false;
  }


  ngOnDestroy() {
    this.commonCustomService.unsubscribe(this.subscribeAll$);
  }

}
