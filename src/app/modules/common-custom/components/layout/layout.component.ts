import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    // this.route.data
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
  }
}
