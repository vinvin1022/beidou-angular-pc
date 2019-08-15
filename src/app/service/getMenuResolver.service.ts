import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class GetMenuResolverService implements Resolve<any> {
  constructor(private router: Router, private requestService: RequestService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.requestService.post('dms/common/saveProId', {}).pipe(
      take(1),
      mergeMap(saveProId => {
        if (saveProId) {
          console.log(saveProId);
          return of(saveProId);
        } else { // id not found
          // this.router.navigate(['/crisis-center']);
          return EMPTY;
        }
      })
    );
  }
}
