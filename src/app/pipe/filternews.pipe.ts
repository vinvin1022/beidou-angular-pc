import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filternews'
})
export class FilternewsPipe implements PipeTransform {
  transform(news: Array<any>, prop: string = 'title', val: string): any {
    if (!val) {
      return news;
    }
    return news.filter((item) => {
      const p = item[prop];
      return p.indexOf(val) >= 0;
    });
  }

}
