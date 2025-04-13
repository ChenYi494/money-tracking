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
  selector: 'app-time-bar',
  standalone: true,
  imports: [CommonModule, CardComponent, NgxEchartsDirective],
  templateUrl: './time-bar.component.html',
  styleUrl: './time-bar.component.scss',
  providers: [provideEcharts()],
})
export class TimeBarComponent implements OnInit, OnDestroy {
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

  chartOption = {};
  hours = Array.from([...Array(24).keys()]);

  constructor(
    private centerSVC: CenterService
  ) {
    this.centerSVC.eachDateRank$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      let data = res['data'];
      this.chartSetting(data);
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
      this.chartSetting(this.data['default']);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // 圖表設定（柱狀圖）
  chartSetting(originData) {
    let allDate = Object.keys(originData).map(e => e.replaceAll('-', '/'))
    let expendData = Object.values(originData).map(e => {
      let temp = [];
      Object.keys(e).forEach(test => {
        temp.push({
          category: test,
          data: e[test]
        })
      })
      temp.sort((a, b) => b.data - a.data);
      return {
        date: e['date'],
        expend_filter: temp.map((el, i) => {
          return {
            rank: `rank${i + 1}`,
            type: el['category'],
            value: el['data'],
            label: {
              show: true,
              position: 'top',
              formatter: `${el['category'].split('').join('\n')}`,
              fontSize: 14,
              color: '#fff',
            },
          }
        })
      }
    });

    // 資料轉換
    let tranformData = [];
    let name = ['最高', '次高'];
    name.forEach((e, i) => {
      let dataArr = [];
      expendData.forEach((el: any) => {
        dataArr.push(el['expend_filter'][i]);
      })

      tranformData.push(
        {
          name: i === 0 ? '最高' : '次高',
          type: 'bar',
          barGap: 0,
          barWidth: '18',
          color: i === 0 ? '#64b5f6' : '#ffa6c1',
          data: dataArr
        })
    })

    this.chartOption = {
      legend: {
        type: 'scroll',
        itemWidth: 20,
        itemHeight: 12,
        right: 20,
        top: 0,
        data: name,
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params => {
          let result = `${params[0]['axisValue']}<br/>`
          params.forEach(e => {
            if (typeof e['data'] !== 'undefined') {
              result += `${e['marker']}${e['seriesName']}：${e['data']['type']}（${e['data']['value']}元）<br/>`
            }
          })
          return result;
        })
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '30%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: allDate,
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12.5,
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            fontSize: 18,
            padding: 25,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#fff',
              opacity: 0.25,
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value} 元',
            color: '#fff',
            fontSize: 12.5,
          }
        }
      ],
      series: tranformData
    };

    if (tranformData['0']['data'].length > 5) {
      this.chartOption['dataZoom'] = {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 75,
        end: 100,
        bottom: -23.5,
      }
    }
  }
}
