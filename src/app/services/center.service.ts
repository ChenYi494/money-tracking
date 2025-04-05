import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  constructor() { }

  // Subject
  updateCustom$ = new Subject();
  menuStatus$ = new Subject();
  // 測試中(全部一起送或分開送資料)
  filter$ = new Subject();
  remainBudget$ = new Subject();
  totalData$ = new Subject();
  rankData$ = new Subject();
  eachDateTotal$ = new Subject();
  eachDateRank$ = new Subject();
  detailRank$ = new Subject();

  eachDayData;
  eachMonthBudget;
  allIncomeCategory;
  allExpendCategory;

  // 變數
  week_type = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
  }

  isCustomStatus = false;
  isCollapse = false;

  // 讀取使用者設定
  public get_all_page_cfg() {
    const pages_data = localStorage.getItem('cfg')!;
    return JSON.parse(pages_data);
  }

  // 讀取分頁
  public get_lv1_cfg(url: string, init: boolean = false, child: boolean = false) {
    let pages_data = JSON.parse(localStorage.getItem('cfg')!);
    let path_lv1 = url.split('/')[1].split('?')[0];
    let lv1 = _.find(pages_data, { router: path_lv1 });
    if (child) {
      return typeof lv1 == 'undefined' ? [] : lv1.child_page;
    } else {
      return typeof lv1 == 'undefined' ? [] : lv1.page_configs;
    }
  }
}
