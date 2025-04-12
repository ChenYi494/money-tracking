import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// component
import { EditCategoryComponent } from '../../shared-components/allmodal/edit-category/edit-category.component';
// ng-zorro
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// service
import { CenterService } from '../../services/center.service';
import { ApiService } from '../../services/api.service';

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
  // 狀態
  deleteIncomeStatus = false;
  deleteExpendStatus = false;
  // 資料
  allIncomeCategory = [];
  allExpendCategory = [];

  constructor(
    private centerSVC: CenterService,
    private modalService: NzModalService,
    private apiSVC: ApiService,
  ) {
    // 從header傳遞資訊確認資料取得完成
    this.centerSVC.isDataLoaded$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(isLoaded => {
        if (isLoaded) this.getCategory();
      });
  }

  ngOnInit(): void {
    // 取得所有分類
    this.getCategory();
  }

  // 取得所有分類
  getCategory() {
    this.allIncomeCategory = this.centerSVC['allIncomeCategory'];
    this.allExpendCategory = this.centerSVC['allExpendCategory'];
  }

  // 新增分類
  createCategory(type) {
    const modalRef = this.modalService.create({
      nzWidth: '300px',
      nzFooter: null,
      nzContent: EditCategoryComponent,
      nzData: {
        type: type,
        data: type === 'income' ? this.allIncomeCategory : this.allExpendCategory
      },
    });

    modalRef.afterClose.subscribe((result: any) => {
      if (result) {
        // 新增一筆分類
        let req_body = {
          type: result['type'] === 'income' ? '收入' : '支出',
          name: result['name']
        }
        this.apiSVC.post('/api/category/create', req_body).then((res) => {
          alert(res['data']);
        })

        // 更新資料
        this.updateData();
      }
    });
  }

  // 刪除分類
  deleteItem(item) {
    // 刪除一筆分類
    let req_body = {
      id: item['id'],
    }
    this.apiSVC.post('/api/category/delete', req_body).then((res) => {
       alert(res['data']);
    })


    // 更新資料
    this.updateData();
  }

  // 更新資料
  updateData() {
    // 重新撈資料
    this.apiSVC.get('/api/category/info').then((data: any) => {
      this.centerSVC['allIncomeCategory'] = data['data'].filter(e => e['type'] === '收入');
      this.centerSVC['allExpendCategory'] = data['data'].filter(e => e['type'] === '支出');
      this.getCategory(); // 重新跑頁面
    });
  }

  // 刪除(狀態設定)
  deleteCategory(type) {
    if (type === 'income') {
      this.deleteIncomeStatus = true;
      this.deleteExpendStatus = false;
    } else {
      this.deleteIncomeStatus = false;
      this.deleteExpendStatus = true;
    }
  }

  // 儲存(狀態設定)
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
