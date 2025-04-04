import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicComponentHost]',
  standalone: true,
})
export class CustomHostDirective {
  constructor(private _viewContainerRef: ViewContainerRef) { }
  public viewContainerRef = this._viewContainerRef;

  public componentMap = async () => {
    // 自訂義元件
    const { WaterComponent } = await import('./water/water.component');
    const { ValueComponent } = await import('./value/value.component');
    const { BarRankingComponent } = await import('./bar-ranking/bar-ranking.component');
    const { DataStatisticsComponent } = await import('./data-statistics/data-statistics.component');
    const { RankingFormComponent } = await import('./ranking-form/ranking-form.component');
    const { PieChartComponent } = await import('./pie-chart/pie-chart.component');
    const { TimeLineComponent } = await import('./time-line/time-line.component');
    const { TimeBarComponent } = await import('./time-bar/time-bar.component');

    return {
      water: WaterComponent,
      value: ValueComponent,
      barRanking: BarRankingComponent,
      dataStatistics: DataStatisticsComponent,
      rankingForm: RankingFormComponent,
      pieChart: PieChartComponent,
      timeLine: TimeLineComponent,
      timeBar: TimeBarComponent,
    };
  };
}
