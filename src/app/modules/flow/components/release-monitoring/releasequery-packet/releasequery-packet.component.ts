import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-releasequery-packet',
  templateUrl: './releasequery-packet.component.html',
  styleUrls: ['./releasequery-packet.component.scss']
})
export class ReleaseQueryPacketComponent implements OnInit {

  public authority: object;
  constructor(private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.authority = data.authority;
    });
  }

}
