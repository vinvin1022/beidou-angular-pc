import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genquery-packeta',
  templateUrl: './genquery-packetA.component.html',
  styleUrls: ['./genquery-packetA.component.scss']
})
export class GenqueryPacketAComponent implements OnInit {

  public authority: object;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.authority = data.authority;
    });
  }
}
