import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { menuJson } from '../../../../../menuJson';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsideMenuComponent implements OnInit {
  public menuJson: Array<object>;
  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const menus = JSON.parse(sessionStorage.getItem('menu'));
    // const menus = menuJson;
    this.menuJson = this._formatMenu(menus);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.menuJson = this._formatMenu(menus);
      }
    });
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  openHandler(menuId: string): void {
    this.menuJson.forEach((value) => {
      value['open'] = value['menuId'] === menuId ? true : false;
    });
  }


  private _formatMenu(menus: Array<any> = []): Array<any> {
    const urls = this.router.url.split('/');
    if (menus) {
      menus.forEach(parentItem => {
        parentItem.open = parentItem.enName === urls[1] ? true : false;
        if (parentItem.children) {
          parentItem.children.forEach(subItem => {
            subItem.selected = subItem.enName === urls[2] ? true : false;
            if (subItem.menuType === 1) {
              subItem.children = null;
            }
          });
        }
      });
    }
    return menus || [];
  }

}
