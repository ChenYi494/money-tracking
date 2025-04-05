import { Component } from '@angular/core';
// moment
import moment from 'moment';
// service
import { CenterService } from '../../services/center.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  now = '';

  constructor(
    private centerSVC: CenterService,
    private apiSVC: ApiService,
  ) {
    let weekday = this.centerSVC.week_type[moment().weekday()];
    this.now = moment().format('YYYY年MM月DD日') + ` 星期${weekday}`;
  }

  ngOnInit(): void {
  }

  getWeek() {
  }

}
