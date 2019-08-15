import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-bd-breadcrumb',
  templateUrl: './bd-breadcrumb.component.html',
  styleUrls: ['./bd-breadcrumb.component.scss']
})
export class BdBreadcrumbComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }
  public breadcrumbs = [];
  ngOnInit() {
    this._setBreadcrumbs();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._setBreadcrumbs();
      }
    });
  }

  private _setBreadcrumbs() {
    let firstChildRoutes = this.activatedRoute.firstChild;
    const breadcrumbs = [];
    let path = '';
    while (firstChildRoutes) {
      path += '/' + firstChildRoutes.routeConfig.path;
      const breadcrumb = firstChildRoutes.routeConfig.data.breadcrumb;
      breadcrumbs.push({ path, breadcrumb });
      firstChildRoutes = firstChildRoutes.firstChild;
    }
    this.breadcrumbs = breadcrumbs;
  }

}
