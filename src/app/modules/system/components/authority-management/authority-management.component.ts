import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-authority-management',
  templateUrl: './authority-management.component.html',
  styleUrls: ['./authority-management.component.scss']
})
export class AuthorityManagementComponent implements OnInit {
  public searchData;
  constructor() { }
  ngOnInit(): void { }
  acceptSearchData(data) {
    this.searchData = data;
  }

}

