import { Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appIsshowbtn]'
})
export class IsShowBtnDirective {
  @Input()
  set appIsshowbtn(val: String) {
    const buttonList = JSON.parse(sessionStorage.getItem('buttonList'));
    if (buttonList && buttonList.length) {
      const condition = buttonList.find(item => item.menuId === val);
      if (condition) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
  }
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }


}
