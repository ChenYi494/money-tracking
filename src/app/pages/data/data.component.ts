import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// component
import { RecordFormComponent } from '../../shared-components/record-form/record-form.component';
// ng-zorro
import { NzTabsModule } from 'ng-zorro-antd/tabs';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, RecordFormComponent, NzTabsModule],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  isCollapse = false;
  allTheme: any = ['收支紀錄', '預算編列'];
  selectedTheme: string = '收支紀錄';

  constructor(
    private centerSVC: CenterService
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

  // 選擇類型
  selectType(event: any) {
    this.selectedTheme = event;
  }

  // 側邊欄設定
  menuSetting() {
    return !this.isCollapse ? 'open' : 'close';
  }
}
