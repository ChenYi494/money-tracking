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

  // 取得所有資料(視況情使用await或forkjoin)
  async init() {
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
    // 視況情看是要在header還是分頁跑loading
    setTimeout(() => {
      this.centerSVC.isDataLoaded$.next(true);
      this.isLoading = false;
    }, 1000)
  }
}
