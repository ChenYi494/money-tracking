import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  isCollapse = false;

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.menuStatus$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.isCollapse = res['status'];
      })
  }

  // 側邊欄設定
  menuSetting() {
    return !this.isCollapse ? 'open' : 'close';
  }
}
