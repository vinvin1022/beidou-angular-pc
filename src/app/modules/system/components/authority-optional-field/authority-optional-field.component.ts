import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SetMetricsPermissionService } from '../../service/set-metrics-permission.service';

@Component({
  selector: 'app-authority-optional-field',
  templateUrl: './authority-optional-field.component.html',
  styleUrls: ['./authority-optional-field.component.scss']
})
export class AuthorityOptionalFieldComponent implements OnInit, OnChanges {
  @Input() public syllable: Object = {};
  public keysArray: Array<any> = [];
  constructor(private setMetricsPermissionService: SetMetricsPermissionService) { }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    this.keysArray = Object.keys(this.syllable);
  }

  updateAllChecked(typeName): void {
    this.syllable[typeName].indeterminate = false;
    if (this.syllable[typeName].allChecked) {
      this.syllable[typeName].children.forEach(item => item.checked = true);
      this.syllable[typeName].children.forEach(item => item.authorityChecked = true);
    } else {
      this.syllable[typeName].children.forEach(item => item.checked = false);
      this.syllable[typeName].children.forEach(item => item.authorityChecked = false);
    }
    this._emitFields();
  }

  updateSingleChecked(typeName, val): void {
    if (this.syllable[typeName].children.every(item => item.authorityChecked === false)) {
      this.syllable[typeName].allChecked = false;
      this.syllable[typeName].indeterminate = false;
    } else if (this.syllable[typeName].children.every(item => item.authorityChecked === true)) {
      this.syllable[typeName].allChecked = true;
      this.syllable[typeName].indeterminate = false;
    } else {
      this.syllable[typeName].allChecked = false;
      this.syllable[typeName].indeterminate = true;
    }
    for (const iterator of this.syllable[typeName].children) {
      for (const key of val) {
        if (key === iterator.value) {
          iterator.checked = iterator.authorityChecked;
        }
      }
    }


    this._emitFields();
  }

  log(value: string[]): void {
  }


  private _emitFields() {
    this.setMetricsPermissionService.updateMenuFields.emit(this.syllable);
  }

}
