import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-salesquery-packet',
  templateUrl: './salesquery-packet.component.html',
  styleUrls: ['./salesquery-packet.component.scss']
})
export class SalesQueryPacketComponent implements OnInit {

  public authority: Object;
  constructor(private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.authority = data.authority;
    });
  }

}
