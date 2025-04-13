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
  selector: 'app-ranking-form',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './ranking-form.component.html',
  styleUrl: './ranking-form.component.scss'
})
export class RankingFormComponent implements OnInit, OnDestroy {
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
  columnArr = [];
  dataArr = [];

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.detailRank$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        let data = res['data'];
        this.dataArr = [];
        this.columnArr = ['品項', '次數'];

        data.forEach(e => {
          this.dataArr.push(
            {
              item: e['name'],
              value: e['count'],
            },
          )
        })

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
      this.columnArr = ['品項', '次數'];
      this.dataArr = this.data['default'];
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
