import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
// ng-zorro
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
// moment
import moment from 'moment';
// service
import { CenterService } from '../../../services/center.service';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [NzDatePickerModule, FormsModule, NzSelectModule, NgStyle],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss'
})
export class EditFormComponent {
  id: string = '';
  date: string = moment().format('YYYY-MM-DD'); // 預設當日
  month: string = moment().format('YYYY-MM'); // 預設當月
  selectedType: string = '';
  selectedCategory: string = '';
  name: string = '';
  data: number = 0;
  commit: string = '';
  theme: string = '';
  status: string = '';
  typeOption = ['收入', '支出'];
  categoryOption = [];
  allIncomeCategory = [];
  allExpendCategory = [];

  constructor(
    private centerSVC: CenterService,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public source: any,
  ) {
    this.theme = source['theme'];
    this.status = source['status'];
    this.allIncomeCategory = this.centerSVC['allIncomeCategory'].map(e => e['name']);
    this.allExpendCategory = this.centerSVC['allExpendCategory'].map(e => e['name']);
    if (this.theme === '預算編列') {
      this.getCategory('支出');
    }
    // 編輯狀態=>代入資料
    if (this.status === 'edit') {
      this.getCategory(source['data']['type']);
      // 資料設定
      if (this.theme === '收支紀錄') {
        this.date = source['data']['date'];
        this.selectedType = source['data']['type'];
        this.selectedCategory = source['data']['category'];
        this.name = source['data']['name'];
        this.data = source['data']['data'];
        this.commit = source['data']['commit'];
        this.id = source['data']['id'];
      } else if (this.theme === '預算編列') {
        this.month = source['data']['month'];
        this.selectedCategory = source['data']['category'];
        this.data = source['data']['data'];
        this.commit = source['data']['commit'];
        this.id = source['data']['id'];
      }
    }
  }

  // 選擇日期
  onDateChange(date: any): void {
  }

  // 選擇月份
  onMonthChange(month: any): void {
  }

  // 儲存
  submit() {
    let result;
    if (this.theme === '收支紀錄') {
      if (this.selectedType === '' || this.selectedCategory === '' ||
        this.name === '' || this.data === null || this.date === null
      ) {
        alert('資料未填寫完整');
      } else {
        result = {
          id: this.id,
          date: moment(this.date).format('YYYY-MM-DD'),
          type: this.selectedType,
          category: this.selectedCategory,
          name: this.name,
          data: this.data,
          commit: this.commit,
          update_time: moment().format('YYYY-MM-DD HH:mm')
        };
        this.modalRef.close({ status: this.status, data: result, theme: this.theme });
      }
    } else if (this.theme === '預算編列') {
      if (this.selectedCategory === '' || this.data === null || this.month === null) {
        alert('資料未填寫完整');
      } else {
        result = {
          id: this.id,
          month: moment(this.month).format('YYYY-MM'),
          category: this.selectedCategory,
          data: this.data,
          commit: this.commit,
          update_time: moment().format('YYYY-MM-DD HH:mm')
        };
        this.modalRef.close({ status: this.status, data: result, theme: this.theme });
      }
    }
  }

  // 取消
  cancel() {
    this.modalRef.close();
  }

  // 取得對應分類
  getCategory(e) {
    this.selectedCategory = '';
    this.categoryOption = e === '收入' ? this.allIncomeCategory : this.allExpendCategory;
  }
}
