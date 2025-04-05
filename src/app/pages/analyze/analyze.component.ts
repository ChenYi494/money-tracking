import { Component, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
// config
import { analyze } from '../../shared-components/config';
import { CustomHostDirective } from '../../shared-components/custom-host.directive';
// service
import { CenterService } from '../../services/center.service';
import { ApiService } from '../../services/api.service';
// ng-zorro
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
// moment
import moment from 'moment';

@Component({
  selector: 'app-analyze',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomHostDirective, NzDropDownModule, NzRadioModule, NzButtonModule, NzSelectModule, NzDatePickerModule, NzCheckboxModule, NzDividerModule],
  templateUrl: './analyze.component.html',
  styleUrl: './analyze.component.scss'
})
export class AnalyzeComponent {
  @ViewChild(CustomHostDirective) dynamicComponentLoader!: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  page: string = 'analyze';
  pageCfgs: any = [];
  isCollapse: boolean = false;
  isLoading: boolean = false;
  editState: boolean = false;

  // filter
  isExpanded1 = false;
  isExpanded2 = false;
  isExpanded3 = false;
  allChecked1 = true;
  allChecked2 = true;
  indeterminate1 = false;
  indeterminate2 = false;
  radioValue = '近一個月';

  // 資料（收支紀錄）
  allIncomeCategory = [];
  allExpendCategory = [];
  date = ['2025-01-01', '2025-02-28']; // 預設日期
  start_date = '2025-01-01';
  end_date = '2025-02-28';

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private centerSVC: CenterService,
    private apiSVC: ApiService,
  ) {
    // 更新元件
    this.centerSVC.updateCustom$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        if (state) {
          this.init();
          this.ngAfterViewInit();
        }
      });

    // 側邊欄開合
    this.centerSVC.menuStatus$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.isCollapse = res['status'];
      })

    // // 監聽路由變化事件
    // this.router.events
    // .pipe(filter((event) => event instanceof NavigationEnd))
    // .subscribe(() => {
    //   this.updateClassFromRoute();
    // });

  this.isCollapse = this.centerSVC.isCollapse;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.updateClassFromRoute();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();

    // 清除動態生成的元件
    // this.dynamicComponentLoader.viewContainerRef.clear();
  }

  updateClassFromRoute(): void {
    this.init();
  }

  // 初始化
  init() {
    // 取得元件設定
    const lv1_cfg = this.centerSVC.get_lv1_cfg(this.router.url)['components'];
    this.pageCfgs = lv1_cfg.reduce((acc: any, e) => {
      const cfg: any = analyze.find((item: any) => item.id === e.id);
      if (cfg) {
        acc.push({ ...e, ...cfg });
      }
      return acc;
    }, []);

    // 取得基本資料
    this.allIncomeCategory = this.centerSVC['allIncomeCategory'].map(e => {
      return { label: e['name'], value: e['name'], checked: true }
    });
    this.allExpendCategory = this.centerSVC['allExpendCategory'].map(e => {
      return { label: e['name'], value: e['name'], checked: true }
    });
    this.changeDetectorRef.detectChanges();

    // 動態產生元件
    this.dynamicGenerate();
  }

  // 動態產生元件
  async dynamicGenerate(): Promise<void> {
    const component_map = await this.dynamicComponentLoader.componentMap();
    const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;
    // 清除元件
    viewContainerRef.clear();
    this.pageCfgs.forEach((item: any) => {
      // 動態產出模塊
      const componentRef = viewContainerRef.createComponent(component_map[item.type as keyof typeof component_map]);

      // 新增item class
      this.renderer.addClass(componentRef.location.nativeElement, item.class);
      // 設定input
      componentRef.instance['idx'] = item.id;
      componentRef.instance['class'] = item.class;
      componentRef.instance['size'] = item.size;
      componentRef.instance['type'] = item.type
      componentRef.instance['page'] = this.page;
      componentRef.instance['name'] = item.name;
      componentRef.instance['tips'] = item.tips;
      componentRef.instance['data'] = item.data;
      // 自定義編輯狀態
      componentRef.instance['edit'] = this.editState;
    });
    // 重新同步動態生成子元件初始化數值
    this.changeDetectorRef.detectChanges();
    this.search();
  }

  // 編輯、儲存
  edit(state: boolean) {
    // 儲存(cfg覆蓋到init_cfg)
    if (!state) {
      let cfg = JSON.parse(localStorage.getItem('cfg')!);
      localStorage.setItem('init_cfg', JSON.stringify(cfg));
    }
    // 更新頁面元件
    this.editState = state;
    this.dynamicGenerate();
  }

  // 取消
  cancel() {
    // 取消(init_cfg覆蓋到cfg)
    let init_cfg = JSON.parse(localStorage.getItem('init_cfg')!);
    localStorage.setItem('cfg', JSON.stringify(init_cfg));

    // 取得元件設定
    const lv1_cfg = this.centerSVC.get_lv1_cfg(this.router.url)['components'];
    this.pageCfgs = lv1_cfg.reduce((acc: any, e) => {
      const cfg: any = analyze.find((item: any) => item.id === e.id);
      if (cfg) {
        acc.push({ ...e, ...cfg });
      }
      return acc;
    }, []);

    // 更新頁面元件
    this.editState = false;
    this.dynamicGenerate();
  }

  menuSetting() {
    return !this.isCollapse ? 'open' : 'close';
  }

  updateAllChecked(type): void {
    this.indeterminate1 = false;
    this.indeterminate2 = false;
    if (type === 1) {
      if (this.allChecked1) {
        this.allIncomeCategory = this.allIncomeCategory.map(item => ({
          ...item,
          checked: true
        }));
      } else {
        this.allIncomeCategory = this.allIncomeCategory.map(item => ({
          ...item,
          checked: false
        }));
      }
    } else {
      if (this.allChecked2) {
        this.allExpendCategory = this.allExpendCategory.map(item => ({
          ...item,
          checked: true
        }));
      } else {
        this.allExpendCategory = this.allExpendCategory.map(item => ({
          ...item,
          checked: false
        }));
      }
    }
  }

  updateSingleChecked(type): void {
    if (type === 1) {
      if (this.allIncomeCategory.every(item => !item.checked)) {
        this.allChecked1 = false;
        this.indeterminate1 = false;
      } else if (this.allIncomeCategory.every(item => item.checked)) {
        this.allChecked1 = true;
        this.indeterminate1 = false;
      } else {
        this.indeterminate1 = true;
      }
    } else {
      if (this.allExpendCategory.every(item => !item.checked)) {
        this.allChecked2 = false;
        this.indeterminate2 = false;
      } else if (this.allExpendCategory.every(item => item.checked)) {
        this.allChecked2 = true;
        this.indeterminate2 = false;
      } else {
        this.indeterminate2 = true;
      }
    }
  }

  selectOption(type) {
    // 切換展開/收縮狀態
    if (type === 1) {
      this.isExpanded1 = !this.isExpanded1;
      this.isExpanded2 = false;
      this.isExpanded3 = false;
    } else if (type === 2) {
      this.isExpanded2 = !this.isExpanded2;
      this.isExpanded1 = false;
      this.isExpanded3 = false;
    } else if (type === 3) {
      this.isExpanded3 = !this.isExpanded3;
      this.isExpanded1 = false;
      this.isExpanded2 = false;
    }
  }

  onChange(event) {
    this.start_date = moment(event[0]).format('YYYY-MM-DD');
    this.end_date = moment(event[1]).format('YYYY-MM-DD');
  }

  // 查詢
  search() {
    // 依照條件過濾資料
    let selectedInCategory = this.allIncomeCategory.filter(e => e['checked']).map(e => e['label']);
    let selectedExCategory = this.allExpendCategory.filter(e => e['checked']).map(e => e['label']);

    // 防呆
    if (selectedInCategory.length === 0) {
      alert('請至少選擇一種收入類型');
    } else if (selectedExCategory.length === 0) {
      alert('請至少選擇一種支出類型');
    } else {
      this.isLoading = true;
      this.isExpanded1 = false;
      this.isExpanded2 = false;
      this.isExpanded3 = false;

      // 時間設定
      let start_date = '';
      let end_date = '';
      switch (this.radioValue) {
        case '當日':
          start_date = moment().format('YYYY-MM-DD');
          end_date = moment().format('YYYY-MM-DD');
          break;
        case '近一週':
          start_date = moment().subtract(6, 'days').format('YYYY-MM-DD');
          end_date = moment().format('YYYY-MM-DD');
          break;
        case '近一個月':
          start_date = moment().subtract(1, 'months').format('YYYY-MM-DD');
          end_date = moment().format('YYYY-MM-DD');
          break;
        case '近三個月':
          start_date = moment().subtract(3, 'months').format('YYYY-MM-DD');
          end_date = moment().format('YYYY-MM-DD');
          break;
        case '近六個月':
          start_date = moment().subtract(6, 'months').format('YYYY-MM-DD');
          end_date = moment().format('YYYY-MM-DD');
          break;
        case '自訂時間': // 待調整
          start_date = this.start_date;
          end_date = this.end_date;
          break;
      }

      let req_body = {
        income_category: selectedInCategory,
        expend_category: selectedExCategory,
        start_date: start_date,
        end_date: end_date
      }

      // 取得所有分析資料
      // 當月剩餘預算
      this.apiSVC.get('/api/analyze/remain_budget').then((res) => {
        this.centerSVC.remainBudget$.next({
          data: res['data']
        })
      })
      // 總收入支出結餘
      this.apiSVC.post('/api/analyze/total', req_body).then((res) => {
        this.centerSVC.totalData$.next({
          data: res['data']
        })
      })
      // 收入支出排名
      this.apiSVC.post('/api/analyze/rank', req_body).then((res) => {
        this.centerSVC.rankData$.next({
          data: res['data']
        })
      })
      // 每日總收入/支出資料
      this.apiSVC.post('/api/analyze/each_date_total', req_body).then((res) => {
        this.centerSVC.eachDateTotal$.next({
          data: res['data']
        })
      })
      // 每日支出前兩名
      this.apiSVC.post('/api/analyze/each_date_rank', req_body).then((res) => {
        this.centerSVC.eachDateRank$.next({
          data: res['data']
        })
      })
      // 詳細品項排名
      this.apiSVC.post('/api/analyze/detail_rank', req_body).then((res) => {
        this.centerSVC.detailRank$.next({
          data: res['data']
        })
      })

      // 非編輯狀態時再跑loading
      if (!this.editState) {
        setTimeout(() => {
          // this.sendResult(resultData, start_date, end_date, monthBudget, monthExpend);
          this.isLoading = false;
        }, 1000)
      } else {
        // this.sendResult(resultData, start_date, end_date, monthBudget, monthExpend);
        this.isLoading = false;
      }
    }
  }

  // 傳送訊息
  sendResult(resultData, start_date, end_date, monthBudget, monthExpend) {
    // this.isLoading = false;
    this.centerSVC.filter$.next({
      data: resultData,
      start_date: start_date,
      end_date: end_date,
      buget_status: {
        monthExpend,
        monthBudget
      }
    })
  }
}
