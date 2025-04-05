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
// data
import { allIncomeCategory, allExpendCategory } from '../data';

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
    '#FF8181',
    '#FFC04D',
    '#D093FF',
    '#54D6FF',
    '#94FFB8',
    '#FF7E05',
    '#FF5330',
    '#96CD45',
    '#2B81AF'
  ];

  chartOption = {};
  hours = Array.from([...Array(24).keys()]);

  constructor(
    private centerSVC: CenterService
  ) {
    // this.centerSVC.filter$
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe((res: any) => {
    //     let data = [];
    //     let sum = 0;
    //     if (this.name === '各分類收入') {
    //       res['data'].forEach(e => {
    //         data.push(...e['income_detail']);
    //         sum += e['total_income'];
    //       })
    //     } else if (this.name === '各分類支出') {
    //       res['data'].forEach(e => {
    //         data.push(...e['expend_detail']);
    //         sum += e['total_expend'];
    //       })
    //     }
    //     this.dataCalc(data, sum);
    //   })

    this.centerSVC.rankData$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      let data = res['data'];
      if (this.name === '各分類收入') {
        let sum = data['income'].reduce((acc, cur) => acc + cur);
        this.chartSetting2(data['income'], sum);
      } else if (this.name === '各分類支出') {
        let sum = data['expend'].reduce((acc, cur) => acc + cur);
        this.chartSetting2(data['expend'], sum);
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
      this.chartSetting2(this.data['default'], 100); // sum待調整
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // 圖表設定(柱狀圖)
  chartSetting(mergedData, sum) {
    let dataArr = [];
    mergedData.forEach((e, i) => {
      dataArr.push(
        {
          name: e['category'],
          value: e['value'],
          itemStyle: {
            color: '#fa0'
          }
        }
      )
    })

    let temp = this.name === '各分類收入(圖表)' ? allIncomeCategory : allExpendCategory;
    temp.forEach(category => {
      // 检查 dataArr 中是否已有该项
      let exists = dataArr.some(item => item.name === category);

      // 如果没有该项，添加到 dataArr
      if (!exists) {
        dataArr.push({
          name: category,
          value: 0,
          itemStyle: {
            color: '#fa0'
          }
        });
      }
    });

    this.chartOption = {
      grid: {
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: dataArr.map(e => e['name']),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            margin: 15,
            textStyle: {
              color: '#FFF',
              fontFamily: 'Noto Sans CJK TC',
              fontSize: '18px',
              fontWeight: 'lighter',
            },
            interval: 0  // 顯示所有標籤
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#FFF',
              fontFamily: 'Noto Sans CJK TC',
              fontSize: '16px',
              fontWeight: 'lighter'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              opacity: 0.3
            }
          }
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: '20%',
          categoryGap: '60%',
          data: dataArr,
          label: {
            show: true,
            distance: 10,
            position: 'top',
            textStyle: {
              color: '#FFF',
              fontFamily: 'Noto Sans CJK TC',
              fontSize: '18px',
              fontWeight: 'bold'
            },
            formatter: function (params) {
              return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          },
          showBackground: false,
        },
      ],
    };
  }

  // 圓餅圖
  chartSetting2(mergedData, sum) {
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

    // let temp = this.name === '各分類收入' ? allIncomeCategory : allExpendCategory;
    // temp.forEach(category => {
    //   // 检查 dataArr 中是否已有该项
    //   let exists = dataArr.some(item => item.name === category);

    //   // 如果没有该项，添加到 dataArr
    //   if (!exists) {
    //     dataArr.push({
    //       name: category,
    //       value: 0,
    //       itemStyle: {
    //         color: '#fa0'
    //       }
    //     });
    //   }
    // });

    this.chartOption = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params => {
          // let result = `${params['marker']}${params['name']}：${params['data']['value']}元（${Math.round((params['data']['value'] / sum) * 100)}％）<br/>`
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
