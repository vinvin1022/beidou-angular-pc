import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genquery-packet',
  templateUrl: './genquery-packet.component.html',
  styleUrls: ['./genquery-packet.component.scss']
})
export class GenqueryPacketComponent implements OnInit {

  public authority: object;
  constructor(private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.authority = data.authority;
    });
  }
}
