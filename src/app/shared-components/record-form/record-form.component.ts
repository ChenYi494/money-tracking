import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
// ng-zorro
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
// component
import { EditFormComponent } from '../allmodal/edit-form/edit-form.component';
// rxjs
import { ReplaySubject, takeUntil } from 'rxjs';
// service
import { CenterService } from '../../services/center.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [NzTableModule, NzModalModule, NgStyle],
  templateUrl: './record-form.component.html',
  styleUrl: './record-form.component.scss'
})
export class RecordFormComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @Input() selectedTheme: string; // 收支紀錄/預算編列
  viewMode: string = 'card'; // card/table
  editStatus: boolean = false; // 編輯狀態
  // 原始資料
  eachDayData = [];
  eachMonthBudget = [];
  allDate = [];
  allMonth = [];
  // 卡片資料
  cardData = [];

  constructor(
    private modalService: NzModalService,
    private centerSVC: CenterService,
    private apiSVC: ApiService,
  ) {
    // 從header傳遞資訊確認資料取得完成
    this.centerSVC.isDataLoaded$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(isLoaded => {
        if (isLoaded) this.getData();
      });
  }

  ngOnInit() {
  }

  ngOnChanges(changes): void {
    if(typeof this.centerSVC.eachDayData !== 'undefined') {
      this.getData();
    }
  }

  // 取得資料
  getData() {
    // 收支
    this.eachDayData = this.centerSVC['eachDayData']
    .sort((a, b) => { // 依日期排序
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateB - dateA;
    })
    // 預算
    this.eachMonthBudget = this.centerSVC['eachMonthBudget']
    .sort((a, b) => { // 依月份排序
      const dateA: any = new Date(a.month + '-01');
      const dateB: any = new Date(b.month + '-01');
      return dateB - dateA;
    })
    this.dataSetting();
  }

  // 設定資料
  dataSetting() {
    // 清空資料
    this.cardData = [];

    // 設定資料
    switch (this.selectedTheme) {
      case '收支紀錄':
        // 卡片設定
        this.cardData = this.eachDayData.map(e => ({
          ...e,
          date: e.date.replaceAll('-', '/'),
          income_detail: e.income_detail.map(el => ({ ...el, type: '收入', date: e.date.replaceAll('-', '/') })),
          expend_detail: e.expend_detail.map(el => ({ ...el, type: '支出', date: e.date.replaceAll('-', '/') }))
        }));
        break;
      case '預算編列':
        // 卡片設定
        this.cardData = this.eachMonthBudget.map(e => ({
          ...e,
          month: e.month.replaceAll('-', '/'),
          budget_detail: e.budget_detail.map(el => ({ ...el, type: '預算', month: e.month.replaceAll('-', '/') })),
        }));
        break;
    }
  }

  // 開啟新增/編輯modal
  openModal(status, data) {
    // 關閉編輯模式
    if (status === 'create') {
      this.editStatus = false;
    }

    const modalRef = this.modalService.create({
      nzWidth: '45rem',
      nzFooter: null,
      nzContent: EditFormComponent,
      nzData: {
        status: status, // 新增/編輯
        data: data, // 新增時為[]/編輯時為該筆資料
        theme: this.selectedTheme
      },
    });

    modalRef.afterClose.subscribe((result: any) => {
      if (result) {
        // 新增/編輯資料
        if (result['status'] === 'create') {
          this.createData(result);
        } else if (result['status'] === 'edit') {
          this.editData(result);
        }
      }
    });
  }

  // 新增資料
  createData(result) {
    let req_body = {};
    if (this.selectedTheme === '收支紀錄') {
      req_body = {
        type: result['data']['type'],
        category: result['data']['category'],
        name: result['data']['name'],
        date: result['data']['date'],
        cost: result['data']['data'],
        commit: result['data']['commit'],
        update_time: result['data']['update_time'],
        user: "admin",
        big_type: '收支'
      }
    } else if(this.selectedTheme === '預算編列') {
      req_body = {
        type: '支出',
        category: result['data']['category'],
        name: '',
        month: result['data']['month'],
        cost: result['data']['data'],
        commit: result['data']['commit'],
        update_time: result['data']['update_time'],
        user: "admin",
        big_type: '預算'
      }
    }

    this.apiSVC.post('/api/upload/create_data', req_body).then((res) => {
      alert(res['data']);
    })

    // 更新資料
    this.updateData();
  }

  // 編輯資料
  editData(result) {
    let req_body = {};
    if (this.selectedTheme === '收支紀錄') {
      req_body = {
        type: result['data']['type'],
        category: result['data']['category'],
        name: result['data']['name'],
        date: result['data']['date'],
        cost: result['data']['data'],
        commit: result['data']['commit'],
        update_time: result['data']['update_time'],
        user: 'admin',
        big_type: '收支',
        id: result['data']['id']
      }
    } else if(this.selectedTheme === '預算編列') {
      req_body = {
        type: '預算',
        category: result['data']['category'],
        name: '',
        month: result['data']['month'],
        cost: result['data']['data'],
        commit: result['data']['commit'],
        update_time: result['data']['update_time'],
        user: 'admin',
        big_type: '預算',
        id: result['data']['id']
      }
    }

    this.apiSVC.post('/api/upload/update_data', req_body).then((res) => {
      alert(res['data']);
    })

    // 更新資料
    this.updateData();
  }

  // 刪除資料
  delete(data) {
    let req_body = {};
    if (this.selectedTheme === '收支紀錄') {
      req_body = {
        id: data['id'],
        big_type: '收支'
      }
    } else if(this.selectedTheme === '預算編列') {
      req_body = {
        id: data['id'],
        big_type: '預算'
      }
    }

    this.apiSVC.post('/api/upload/delete_data', req_body).then((res) => {
      alert(res['data']);
    })

    // 更新資料
    this.updateData();
  }

  // 更新資料
  updateData() {
    // 重新撈資料
    if (this.selectedTheme === '收支紀錄') {
      this.apiSVC.get('/api/upload/record_ie').then((data: any) => {
        this.centerSVC['eachDayData'] = data['data'];
        this.getData(); // 重新跑頁面
      });
    } else if(this.selectedTheme === '預算編列') {
      this.apiSVC.get('/api/upload/record_bg').then((data: any) => {
        this.centerSVC['eachMonthBudget'] = data['data'];
        this.getData(); // 重新跑頁面
      });
    }
  }

  // 開啟/結束編輯
  editControl() {
    this.editStatus = !this.editStatus;
  }
}
