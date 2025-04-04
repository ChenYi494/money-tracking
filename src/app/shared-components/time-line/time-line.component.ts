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
  selector: 'app-time-line',
  standalone: true,
  imports: [CommonModule, CardComponent, NgxEchartsDirective],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss',
  providers: [provideEcharts()],
})
export class TimeLineComponent implements OnInit, OnDestroy {
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
    this.centerSVC.filter$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        this.chartSetting(res['data']);
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

  // 圖表設定（折線圖）
  chartSetting(originData) {
    originData.sort((a, b) => {
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateA - dateB;
    });
    let incomeData = originData.map(e => e['total_income']);
    let expendData = originData.map(e => e['total_expend']);
    let allDate = originData.map(e => e['date'].replaceAll('-', '/'));
    let name = ['收入', '支出'];
    let data = [];
    name.forEach(e => {
      data.push({
        name: e,
        type: 'line',
        lineStyle: {
          color: e === '收入' ? '#64b5f6' : '#ffa6c1',
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: e === '收入' ? '#64b5f6' : '#ffa6c1',
        },
        data: e === '收入' ? incomeData : expendData
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
              result += `${e['marker']}${e['seriesName']}：${e['data']}元<br/>`
            }
          })
          return result;
        })
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          // data: allDate.map(e => `${e.split('/')[1]}/${e.split('/')[2]}`),
          data: allDate,
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12.5,
            // interval: 0, // 顯示所有x軸標籤
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
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
      series: data
    }

    if (data['0']['data'].length > 5) {
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
