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
  selector: 'app-bar-ranking',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './bar-ranking.component.html',
  styleUrl: './bar-ranking.component.scss'
})
export class BarRankingComponent implements OnInit, OnDestroy {
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
  resData = [];

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.filter$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        let data = [];
        if (this.name === '收入排名') {
          res['data'].forEach(e => {
            data.push(...e['income_detail']);
          })
        } else if (this.name === '支出排名') {
          res['data'].forEach(e => {
            data.push(...e['expend_detail']);
          })
        }
        this.dataCalc(data);
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
      this.dataSetting(this.data['default']);
    }
  }

  dataCalc(data) {
    // 合併相同的category，計算data總和
    const mergedData = data.reduce((acc, item) => {
      const existing = acc.find(entry => entry.category === item.category);
      if (existing) {
        existing.value += item.data;
      } else {
        acc.push({
          category: item.category,
          value: item.data
        });
      }
      return acc;
    }, []).sort((a, b) => b.value - a.value);
    this.dataSetting(mergedData);
  }

  dataSetting(mergedData) {
    // 門檻值設定（待調整）
    let valueMax = Math.max(...mergedData.map(e => e['value'])); // 最大值
    // let valueSum = mergedData.reduce((acc, cur) => {
    //   return acc + cur['value'];
    // }, 0); // 總和
    let threshold = valueMax;
    this.resData = mergedData.map(e => {
      // 門檻值設定
      let dataColor = '';
      let fullColor = '';
      if (e['value'] * 100 / threshold >= 70) {
        dataColor = '#F06449';
        fullColor = '#FCDFD9';
      } else if (e['value'] * 100 / threshold >= 40 && e['value'] * 100 / threshold < 70) {
        dataColor = '#ECA72C';
        fullColor = '#FAEACC';
      } else if (e['value'] * 100 / threshold < 40) {
        dataColor = '#61C9A8';
        fullColor = '#DDF3EC';
      }
      e['width'] = e['value'] * 100 / threshold;
      e['dataColor'] = dataColor;
      e['fullColor'] = fullColor;
      return e;
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  statausSetting1(data) {
    return {
      'background-color': data['dataColor'],
      'width': data['width'] + '%'
    };
  }

  statausSetting2(data) {
    return {
      'background-color': data['fullColor'],
    };
  }
}
