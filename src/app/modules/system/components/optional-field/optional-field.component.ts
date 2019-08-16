import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SetMetricsPermissionService } from '../../service/set-metrics-permission.service';

@Component({
  selector: 'app-optional-field',
  templateUrl: './optional-field.component.html',
  styleUrls: ['./optional-field.component.scss']
})
export class OptionalFieldComponent implements OnInit, OnChanges {
  @Input() public syllable: object = {};
  public keysArray: Array<any> = [];
  constructor(private setMetricsPermissionService: SetMetricsPermissionService) { }

  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    this.keysArray = Object.keys(this.syllable);
  }

  updateAllChecked(typeName): void {
    this.syllable[typeName].indeterminate = false;
    if (this.syllable[typeName].allChecked) {
      this.syllable[typeName].children.forEach(item => item.checked = true);
    } else {
      this.syllable[typeName].children.forEach(item => item.checked = false);
    }
    this._emitFields();
  }

  updateSingleChecked(typeName): void {
    if (this.syllable[typeName].children.every(item => item.checked === false)) {
      this.syllable[typeName].allChecked = false;
      this.syllable[typeName].indeterminate = false;
    } else if (this.syllable[typeName].children.every(item => item.checked === true)) {
      this.syllable[typeName].allChecked = true;
      this.syllable[typeName].indeterminate = false;
    } else {
      this.syllable[typeName].allChecked = false;
      this.syllable[typeName].indeterminate = true;
    }
    this._emitFields();
  }


  private _emitFields() {
    this.setMetricsPermissionService.updateMenuFields.emit(this.syllable);
  }

}
