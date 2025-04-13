import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// component
import { CardComponent } from '../card/card.component';
// interface
import { CardSetting } from '../interface';
// NgxEchart
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, CardComponent, NgxEchartsDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
  providers: [provideEcharts()],
})
export class PieChartComponent implements OnInit, OnDestroy {
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

  // 數量&寫法暫定
  colorList = [
    '#FF6B6B',
    '#F783AC',
    '#FFA94D',
    '#FFD43B',
    '#FF8787',
    '#4DABF7',
    '#38D9A9',
    '#69DB7C',
    '#748FFC',
    '#D8F05E',
    '#B197FC',
  ];

  chartOption = {};
  hours = Array.from([...Array(24).keys()]);

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.rankData$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      let data = res['data'];
      if (this.name === '各分類收入') {
        if(data['income'].length > 0) {
          let sum = data['income'].reduce((acc, cur) => acc + cur);
          this.chartSetting(data['income'], sum);
        } else {
          this.chartOption = {};
        }
      } else if (this.name === '各分類支出') {
        if(data['expend'].length > 0) {
          let sum = data['expend'].reduce((acc, cur) => acc + cur);
          this.chartSetting(data['expend'], sum);
        } else {
          this.chartOption = {};
        }
      }
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
      this.chartSetting(this.data['default'], 100); // sum待調整
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // 圓餅圖
  chartSetting(mergedData, sum) {
    let dataArr = [];
    mergedData.forEach((e, i) => {
      dataArr.push({
        value: e['value'],
        name: e['category'],
        itemStyle: {
          color: this.colorList[i]
        }
      })
    })

    this.chartOption = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params => {
          let result = `${params['marker']}${params['name']}：${params['data']['value']}元（${(params['percent'])}％）<br/>`
          return result;
        })
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: '15%',
        y: 'center',
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
          color: '#FFF',
          fontFamily: 'Noto Sans CJK TC',
          fontSize: '16px',
        },
        pageIconColor: '#FFF',
        pageIconInactiveColor: '#555',
        pageTextStyle: {
          color: '#FFF',
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          // radius: '85%',
          radius: ['30%', '80%'],
          center: ['30%', '50%'],
          label: {
            show: false,
            position: 'inside',
            color: '#000',
            fontFamily: 'Noto Sans CJK TC',
            fontSize: '16px',
            fontWeight: 'bold',
            formatter: (params) => {
              return params['value'];
            }
          },
          data: dataArr,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
        },
      ]
    };
  }
}
