import { Injectable } from '@angular/core';
import { Subject, AsyncSubject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private sxSubject$ = new Subject<any>();
  private sxAsyncSubject$ = new AsyncSubject<any>();
  private sxBehaviorSubject$ = new BehaviorSubject<any>({});
  private sxReplaySubject$ = new ReplaySubject<any>();


  constructor() { }

  subscribMessage(key: string = 'sxSubject$') {
    return this[key].asObservable();
  }

  sendMessage(val, key: string = 'sxSubject$') {
    this[key].next(val);
  }
  unsubscribMessage(key: string = 'sxSubject$') {
    this[key].unsubscribe();
  }

}
