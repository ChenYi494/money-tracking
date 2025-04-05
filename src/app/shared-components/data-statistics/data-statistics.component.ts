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
// moment
import moment from 'moment';

@Component({
  selector: 'app-data-statistics',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './data-statistics.component.html',
  styleUrl: './data-statistics.component.scss'
})
export class DataStatisticsComponent implements OnInit, OnDestroy {
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
  allDataCount = 0;
  haveDataCount = 0;
  noDataCount = 0;
  alreadyRecord = true;

  constructor(
    private centerSVC: CenterService
  ) {
    // this.centerSVC.filter$
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe((res: any) => {
    //     this.allDataCount = moment(res['end_date']).diff(moment(res['start_date']), 'days') + 1;
    //     this.haveDataCount = res['data'].length;
    //     this.noDataCount = this.allDataCount - this.haveDataCount;
    //     let allDataDate = res['data'].map(e => e['date']);
    //     if (allDataDate.includes(moment().format('YYYY-MM-DD'))) {
    //       this.alreadyRecord = true;
    //     } else {
    //       this.alreadyRecord = false;
    //     }
    //   })

    this.centerSVC.eachDateTotal$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      let data = res['data'];
      this.allDataCount = moment(res['end_date']).diff(moment(res['start_date']), 'days') + 1;
      this.haveDataCount = Object.keys(data).length;
      this.noDataCount = this.allDataCount - this.haveDataCount;
      // let allDataDate = res['data'].map(e => e['date']);
      // if (allDataDate.includes(moment().format('YYYY-MM-DD'))) {
      //   this.alreadyRecord = true;
      // } else {
      //   this.alreadyRecord = false;
      // }
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
      this.allDataCount = this.data['default'][0];
      this.haveDataCount = this.data['default'][1];
      this.noDataCount = this.data['default'][2];
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
