import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extension-index',
  templateUrl: './extension-index.component.html',
  styleUrls: ['./extension-index.component.scss']
})
export class ExtensionIndexComponent implements OnInit {
  public filterData: Object;
  public packagePermissions: String = 'b030202';

  constructor() { }

  ngOnInit() {
  }
  getQueryData(data) {
    this.filterData = data;
  }

}
