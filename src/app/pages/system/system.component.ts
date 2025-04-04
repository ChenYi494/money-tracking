import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// component
import { SystemSettingComponent } from '../../shared-components/system-setting/system-setting.component';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, SystemSettingComponent],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent implements OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  isCollapse = false;

  constructor(
    private centerSVC: CenterService,
  ) {
    this.centerSVC.menuStatus$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.isCollapse = res['status'];
      })
  }

  ngOnInit(): void {
    this.isCollapse = this.centerSVC.isCollapse;
  }

  // 側邊欄設定
  menuSetting() {
    return !this.isCollapse ? 'open' : 'close';
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
