import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailyReportsService {
  public dailyReportsData: Array<any> = [];
  public loading = false;
  constructor() { }
}
