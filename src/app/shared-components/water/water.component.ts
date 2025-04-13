import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// component
import { CardComponent } from '../card/card.component';
// service
import { CenterService } from '../../services/center.service';
// interface
import { CardSetting } from '../interface';
// NgxEchart
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-water',
  standalone: true,
  imports: [CommonModule, CardComponent, NgxEchartsDirective],
  templateUrl: './water.component.html',
  styleUrl: './water.component.scss',
  providers: [provideEcharts()],
})
export class WaterComponent implements OnInit, OnDestroy {
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
  chartOptions: any = {};
  rate = 0;
  textColor: string = '';
  waterColor: string[] = [];
  waterColor2: string = '';

  remainBudget = 0;

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.remainBudget$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        let data = res['data'];
        this.remainBudget = data['value'];
        this.rate = Math.round(data['percent'] * 100);
        this.dataSetting();
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
      this.remainBudget = 8000;
      this.rate = 75;
      this.dataSetting();
    }
  }

  dataSetting() {
    if (this.rate > 70) {
      this.textColor = '#14746f';
      this.waterColor2 = 'rgba(224, 235, 255, 0.1)';
    } else if (this.rate <= 70 && this.rate >= 30) {
      this.textColor = '#de9610';
      this.waterColor2 = 'rgba(255, 242, 213, 0.1)';
    } else {
      this.textColor = '#F06449';
      this.waterColor2 = 'rgba(253, 223, 235, 0.1)';
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
