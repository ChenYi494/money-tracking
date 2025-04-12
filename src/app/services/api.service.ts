import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReplaySubject } from 'rxjs';

const config = {
  serverIP: environment.serverIP,
  reqHeader: new HttpHeaders({
    'Content-Type': 'application/json',
    'access-control-allow-origin': '*',
    // authorization: 'Bearer ' + localStorage.getItem('token'), // JWT放這裡
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  token: string;
  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  public set_token(token: string) {
    config.reqHeader = config.reqHeader.set('authorization', 'Bearer ' + token); // JWT放這裡
  }

  // get方法
  public get(url: string): Promise<any> {
    const URL = config.serverIP + url;
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(URL, { headers: config.reqHeader })
        .subscribe(this.handleResponse(resolve, reject));
    });
  }

  // post方法
  public post(url: string, data: any): Promise<any> {
    const URL = config.serverIP + url;
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(URL, data, { headers: config.reqHeader })
        .subscribe(this.handleResponse(resolve, reject));
    });
  }

  // put方法
  public put(url: string, data: any): Promise<any> {
    const URL = config.serverIP + url;
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(URL, data, { headers: config.reqHeader })
        .subscribe(this.handleResponse(resolve, reject));
    });
  }

  // delete方法
  public delete(url: string, data?: any): Promise<any> {
    const URL = config.serverIP + url;
    return new Promise((resolve, reject) => {
      this.http
        .delete<any>(URL, { headers: config.reqHeader, body: data })
        .subscribe(this.handleResponse(resolve, reject));
    });
  }

  // 錯誤跳轉
  handleResponse(resolve: any, reject: any) {
    return {
      next: (res: any) => {
        resolve(res);
      },
      error: (err: any) => {
        console.log(err);
        this.message.create('error', '資料有誤，請重新搜尋');
      },
    };
  }
}
