import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// component
import { EditCategoryComponent } from '../../shared-components/allmodal/edit-category/edit-category.component';
// ng-zorro
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-system-setting',
  standalone: true,
  imports: [CommonModule, NzModalModule, EditCategoryComponent, SystemSettingComponent],
  templateUrl: './system-setting.component.html',
  styleUrl: './system-setting.component.scss'
})
export class SystemSettingComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  isCollapse = false;
  // 編輯狀態
  deleteIncomeStatus = false;
  deleteExpendStatus = false;
  // 資料
  allIncomeCategory = [];
  allExpendCategory = [];
  eachDayData = [];

  selectedColorTheme = 'dark';

  constructor(
    private centerSVC: CenterService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {
    // 取得所有收支資料
    this.eachDayData = JSON.parse(localStorage.getItem('eachDayData'));
    this.init();
  }

  init() {
    // 取得所有收支種類
    this.allIncomeCategory = JSON.parse(localStorage.getItem('allIncomeCategory'));
    this.allExpendCategory = JSON.parse(localStorage.getItem('allExpendCategory'));
  }

  changeColorTheme(type) {
    this.selectedColorTheme = type;
  }

  // 新增分類
  createCategory(type) {
    const modalRef = this.modalService.create({
      nzWidth: '300px',
      nzFooter: null,
      nzContent: EditCategoryComponent,
      nzData: {
        type: type, // 收入/支出
        data: type === 'income' ? this.allIncomeCategory : this.allExpendCategory
      },
    });

    modalRef.afterClose.subscribe((result: any) => {
      if (result) {
        if (result['type'] === 'income') {
          this.allIncomeCategory.push(result['name']);
          localStorage.setItem('allIncomeCategory', JSON.stringify(this.allIncomeCategory));
        } else if (type === 'expend') {
          this.allExpendCategory.push(result['name']);
          localStorage.setItem('allExpendCategory', JSON.stringify(this.allExpendCategory));
        }
        this.init();
      }
    });

  }

  // 刪除分類
  deleteCategory(type) {
    if (type === 'income') {
      this.deleteIncomeStatus = true;
      this.deleteExpendStatus = false;
    } else {
      this.deleteIncomeStatus = false;
      this.deleteExpendStatus = true;
    }
  }

  // 刪除選項
  deleteItem(type, item) {
    if (type === 'income') {
      this.allIncomeCategory = this.allIncomeCategory.filter(e => e !== item);
      localStorage.setItem('allIncomeCategory', JSON.stringify(this.allIncomeCategory));
    } else if (type === 'expend') {
      this.allExpendCategory = this.allExpendCategory.filter(e => e !== item);
      localStorage.setItem('allExpendCategory', JSON.stringify(this.allExpendCategory));
    }
    // 刪除該分類底下的資料紀錄
    this.resetData(type, item);
    this.init();
  }

  resetData(type, item) {
    this.eachDayData = this.eachDayData.map(e => {
      e['have_data'] = true;
      if (type === 'income') {
        e['income_detail'] = e['income_detail'].filter(el => el['category'] !== item);
        e['total_income'] = e['income_detail'].reduce((acc, cur) => {
          return acc + cur['data'];
        }, 0)
      } else {
        e['expend_detail'] = e['expend_detail'].filter(el => el['category'] !== item);
        e['total_expend'] = e['expend_detail'].reduce((acc, cur) => {
          return acc + cur['data'];
        }, 0)
      }
      if (e['income_detail'].length === 0 && e['expend_detail'].length === 0) {
        e['have_data'] = false;
      }
      return e;
    })
    // 如果是最後一筆，就刪除該日資料
    this.eachDayData = this.eachDayData.filter(e => e['have_data']);
    localStorage.setItem('eachDayData', JSON.stringify(this.eachDayData));
  }

  // 儲存結果
  saveResult(type) {
    if (type === 'income') {
      this.deleteIncomeStatus = false;
    } else {
      this.deleteExpendStatus = false;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
