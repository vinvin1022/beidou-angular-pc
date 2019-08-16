import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-extquery-packet',
  templateUrl: './extquery-packet.component.html',
  styleUrls: ['./extquery-packet.component.scss']
})
export class ExtQueryPacketComponent implements OnInit {
  public authority: object;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.authority = data.authority;
    });
  }

}
