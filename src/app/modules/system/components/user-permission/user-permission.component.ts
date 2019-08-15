import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  public searchData;
  constructor() { }

  ngOnInit(): void { }

  goback() {
    history.go(-1);
  }


  acceptSearchData(data) {
    this.searchData = data;
  }
}

