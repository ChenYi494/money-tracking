import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationStart } from '@angular/router';
import { NgClass } from '@angular/common';
// service
import { CenterService } from '../../services/center.service';
// rxjs
import { Subscription } from 'rxjs';
// ng-zorro
import { NzContentComponent, NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NzLayoutComponent,
    NzContentComponent,
    NzMenuModule,
    NzIconModule,
    NzToolTipModule,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private routerSubscription: Subscription;
  testCfgs = [
    {
      icon: './assets/icon/form.png',
      name: '財務紀錄列表',
      router: '/data'
    },
    {
      icon: './assets/icon/chart.svg',
      name: '綜合數據分析',
      router: '/analyze'
    },
    {
      icon: './assets/icon/setting.svg',
      name: '系統內容設定',
      router: '/system'
    }
  ]

  pageName = '';

  isCollapsed = false;
  constructor(
    private centerSVC: CenterService,
    private router: Router,
  ) {
    this.pageName = '/' + this.router.url.split('/')[1];
    // 訂閱路由事件
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.pageName = event['url'];
      }
    });
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.centerSVC.isCollapse = this.isCollapsed;
    this.centerSVC.menuStatus$.next({
      status: this.isCollapsed
    })
  }

  menuSetting() {
    return !this.isCollapsed ? 'open' : 'close';
  }
}
