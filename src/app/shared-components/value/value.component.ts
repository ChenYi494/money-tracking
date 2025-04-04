import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// component
import { CardComponent } from '../card/card.component';
// interface
import { CardSetting } from '../interface';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-value',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './value.component.html',
  styleUrl: './value.component.scss'
})
export class ValueComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  // 引入頁面動態生成元件時的設定內容（提供card設定使用）
  @Input() idx?: number;
  @Input() class?: string;
  @Input() size?: string;
  @Input() type?: string;
  @Input() page?: string;
  @Input() name?: string;
  @Input() tips?: string;
  @Input() data?: any;
  @Input() edit?: boolean;
  @Input() hasLarge?: boolean;
  // card設定(引用cardSetting interface)
  card!: CardSetting;
  // 元件內容
  quantity: number = 0;

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.filter$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        if (this.name === '總收入') {
          this.quantity = res['data'].reduce((acc, cur) => acc + cur.total_income, 0);
        } else if (this.name === '總支出') {
          this.quantity = res['data'].reduce((acc, cur) => acc + cur.total_expend, 0);
        } else if (this.name === '總結餘') {
          this.quantity = res['data'].reduce((acc, cur) => acc + cur.total_income - cur.total_expend, 0);
        }
        // this.quantity = 1000000;
      })
  }

  ngOnInit(): void {
    // card設定
    this.card = {
      id: this.idx,
      class: this.class,
      size: this.size,
      type: this.type,
      page: this.page,
      name: this.name,
      tips: this.tips,
      data: this.data,
      edit: this.edit,
      hasLarge: true
    }

    // 自定義選單
    if (this.centerSVC.isCustomStatus) {
      this.quantity = this.data['default'];
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
