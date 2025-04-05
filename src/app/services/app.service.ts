import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { allIncomeCategory, allExpendCategory, eachDayData, eachMonthBudget } from '../shared-components/data';
// service
import { CenterService } from './center.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  http = inject(HttpClient);
  centerSVC = inject(CenterService);
  apiSVC = inject(ApiService);
  router = inject(Router);

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'access-control-allow-origin': '*',
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  // 取得資料
  get_ui_record = async () => {
    if (isPlatformBrowser(this.platformId)) {
      // 取得靜態資料
      // await this.http.get('assets/demo_cfg.json').toPromise().then((data: any) => {
      //   localStorage.setItem('cfg', JSON.stringify(data['ui_configs']));
      //   localStorage.setItem('init_cfg', JSON.stringify(data['ui_configs']));
      //   localStorage.setItem('eachDayData', JSON.stringify(eachDayData));
      //   localStorage.setItem('eachMonthBudget', JSON.stringify(eachMonthBudget));
      //   localStorage.setItem('allIncomeCategory', JSON.stringify(allIncomeCategory));
      //   localStorage.setItem('allExpendCategory', JSON.stringify(allExpendCategory));
      // });

      await this.http.get('assets/demo_cfg.json').toPromise().then((data: any) => {
        localStorage.setItem('cfg', JSON.stringify(data['ui_configs']));
        localStorage.setItem('init_cfg', JSON.stringify(data['ui_configs']));
      });
      await this.apiSVC.get('/api/upload/record_ie').then((data: any) => {
        this.centerSVC['eachDayData'] = data['data'];
      });
      await this.apiSVC.get('/api/upload/record_bg').then((data: any) => {
        this.centerSVC['eachMonthBudget'] = data['data'];
      });
      await this.apiSVC.get('/api/category/info').then((data: any) => {
        this.centerSVC['allIncomeCategory'] = data['data'].filter(e => e['type'] === '收入');
        this.centerSVC['allExpendCategory'] = data['data'].filter(e => e['type'] === '支出');
      });

      // 紀錄欲轉跳URL
      localStorage.setItem('into_url', location.href);
      let loc = new URL(localStorage.getItem('into_url')!);
      // 開始轉跳
      this.router.navigate([loc.pathname]);
    }
  };
}
