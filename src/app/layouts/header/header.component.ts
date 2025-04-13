import { Component } from '@angular/core';
// moment
import moment from 'moment';
// service
import { CenterService } from '../../services/center.service';
import { ApiService } from '../../services/api.service';
// component
import { LoadingComponent } from '../../shared-components/loading/loading.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  now = '';
  isLoading: boolean = true;

  constructor(
    private centerSVC: CenterService,
    private apiSVC: ApiService,
  ) {
    let weekday = this.centerSVC.week_type[moment().weekday()];
    this.now = moment().format('YYYY年MM月DD日') + ` 星期${weekday}`;
  }

  ngOnInit(): void {
    // 取得所有資料
    this.init();
  }

  // 取得所有資料
  async init() {
    Promise.all([
      this.apiSVC.get('/api/upload/record_ie'),
      this.apiSVC.get('/api/upload/record_bg'),
      this.apiSVC.get('/api/category/info')
    ])
    .then(([ieData, bgData, categoryData]: any[]) => {
      this.centerSVC['eachDayData'] = ieData['data'];
      this.centerSVC['eachMonthBudget'] = bgData['data'];
      this.centerSVC['allIncomeCategory'] = categoryData['data'].filter(e => e['type'] === '收入');
      this.centerSVC['allExpendCategory'] = categoryData['data'].filter(e => e['type'] === '支出');
    })
    .finally(() => {
      // 視況情看是要在header還是分頁跑loading
      setTimeout(() => {
        this.centerSVC.isDataLoaded$.next(true);
        this.isLoading = false;
      }, 1000);
    });
  }
}
