import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
// service
import { CenterService } from './center.service';
import { ApiService } from './api.service';
// environment
import { environment } from '../../environments/environment';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 取得資料
  get_ui_record = async () => {
    if (isPlatformBrowser(this.platformId)) {
      // 登入帳密(測試)
      let loginTest = {username: 'test', password: '1234'};

      // 取得靜態資料
      await this.http.get('assets/demo_cfg.json').toPromise().then((data: any) => {
        localStorage.setItem('cfg', JSON.stringify(data['ui_configs']));
        localStorage.setItem('init_cfg', JSON.stringify(data['ui_configs']));
      });
      // 取得登入token
      await this.http.post(environment.serverIP + '/api/users/login', loginTest, { headers: this.headers }).toPromise().then((data) => {
        localStorage.setItem('token', data['token']);
        this.apiSVC.set_token(data['token']);
      })

      // 紀錄欲轉跳URL
      localStorage.setItem('into_url', location.href);
      let loc = new URL(localStorage.getItem('into_url')!);
      // 開始轉跳
      this.router.navigate([loc.pathname]);
    }
  };
}
