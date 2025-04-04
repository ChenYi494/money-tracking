import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
// ng-zorro
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
// component
import { EditFormComponent } from '../allmodal/edit-form/edit-form.component';
// moment
import moment from 'moment';

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [NzTableModule, NzModalModule, NgStyle],
  templateUrl: './record-form.component.html',
  styleUrl: './record-form.component.scss'
})
export class RecordFormComponent {
  @Input() selectedTheme: string; // 收支紀錄/預算編列
  viewMode: string = 'card'; // card/table
  editStatus: boolean = false; // 編輯狀態
  // 原始資料
  eachDayData = [];
  eachMonthBudget = [];
  allDate = [];
  allMonth = [];
  // 表格資料
  formColumn = [];
  formData = [];
  // 卡片資料
  cardData = [];

  constructor(
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes): void {
    this.getData();
  }

  // 取得資料
  getData() {
    // 收支
    this.eachDayData = JSON.parse(localStorage.getItem('eachDayData'))
      .sort((a, b) => { // 依日期排序
        const dateA: any = new Date(a.date);
        const dateB: any = new Date(b.date);
        return dateB - dateA;
      })

    // 預算
    this.eachMonthBudget = JSON.parse(localStorage.getItem('eachMonthBudget'))
      .sort((a, b) => { // 依月份排序
        const dateA: any = new Date(a.month + '-01');
        const dateB: any = new Date(b.month + '-01');
        return dateB - dateA;
      });

    this.dataSetting();
  }

  // 設定資料
  dataSetting() {
    // 清空資料
    this.formData = [];
    this.cardData = [];

    // 設定資料
    switch (this.selectedTheme) {
      case '收支紀錄':
        // 卡片設定
        this.cardData = JSON.parse(JSON.stringify(this.eachDayData)).map(e => ({
          ...e,
          date: e.date.replaceAll('-', '/'),
          income_detail: e.income_detail.map(el => ({ ...el, type: '收入', date: e.date.replaceAll('-', '/') })),
          expend_detail: e.expend_detail.map(el => ({ ...el, type: '支出', date: e.date.replaceAll('-', '/') }))
        }));
        // 表格設定
        this.formColumn = ['日期', '類型', '項目', '名稱', '費用', '備註', '更新時間'];
        this.eachDayData.forEach(data => {
          this.allDate.push(data['date']);
          this.addData('收入', data['date'], data.income_detail);
          this.addData('支出', data['date'], data.expend_detail);
        })
        break;
      case '預算編列':
        // 卡片設定
        this.cardData = JSON.parse(JSON.stringify(this.eachMonthBudget)).map(e => ({
          ...e,
          month: e.month.replaceAll('-', '/'),
          budget_detail: e.budget_detail.map(el => ({ ...el, type: '預算', month: e.month.replaceAll('-', '/') })),
        }));
        // 表格設定
        this.formColumn = ['月份', '項目', '預算', '備註', '目前狀態', '更新時間'];
        this.eachMonthBudget.forEach((data) => {
          this.allMonth.push(data['month']);
          this.addData('預算', data['month'], data.budget_detail);
        })
        break;
    }
  }

  // 加入資料（表格）
  addData(type, time, detail_data) {
    detail_data.forEach(el => {
      let content;
      switch (this.selectedTheme) {
        case '收支紀錄':
          content = {
            id: el['id'],
            date: time.replaceAll('-', '/'),
            type: type,
            category: el['category'],
            name: el['name'],
            data: el['data'],
            commit: el['commit'],
            update_time: el['update_time'].split(' ')[0].replaceAll('-', '/'),
          }
          break;
        case '預算編列':
          content = {
            id: el['id'],
            month: time.replaceAll('-', '/'),
            category: el['category'],
            data: el['data'],
            commit: el['commit'],
            update_time: el['update_time'].split(' ')[0].replaceAll('-', '/'),
            progress: '20%'
          }
          break;
      }
      this.formData.push(content);
    })
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
        // 更新資料
        this.updateData();
      }
    });
  }

  // 新增資料
  createData(result) {
    if (result['theme'] === '收支紀錄') {
      let type = result['data']['type']; // 收入/支出
      switch (this.allDate.includes(result['data']['date'])) {
        // 當日第1筆
        case false:
          this.eachDayData.push({
            total_income: type === '收入' ? result['data']['data'] : 0,
            total_expend: type === '支出' ? result['data']['data'] : 0,
            income_detail: type === '收入' ? [
              {
                id: `${moment(result['data']['date']).format('YYYY-MM-DD')}_in_1`,
                type: 'income',
                category: result['data']['category'],
                name: result['data']['name'],
                data: result['data']['data'],
                commit: result['data']['commit'],
                update_time: result['data']['update_time'],
              }
            ] : [],
            expend_detail: type === '支出' ? [
              {
                id: `${moment(result['data']['date']).format('YYYY-MM-DD')}_ex_1`,
                type: 'expend',
                category: result['data']['category'],
                name: result['data']['name'],
                data: result['data']['data'],
                commit: result['data']['commit'],
                update_time: result['data']['update_time'],
              }
            ] : [],
            date: result['data']['date']
          })
          break;
        // 當日第N筆
        case true:
          this.eachDayData = this.eachDayData.map(e => {
            if (e['date'] === result['data']['date']) {
              if (result['data']['type'] === '收入') {
                e['income_detail'].push({
                  id: `${moment(result['data']['date']).format('YYYY-MM-DD')}_in_${e['income_detail'].length + 1}`,
                  type: 'income',
                  category: result['data']['category'],
                  name: result['data']['name'],
                  data: result['data']['data'],
                  commit: result['data']['commit'],
                  update_time: result['data']['update_time']
                })
                e['total_income'] += result['data']['data'];
              } else if (result['data']['type'] === '支出') {
                e['expend_detail'].push({
                  id: `${moment(result['data']['date']).format('YYYY-MM-DD')}_ex_${e['expend_detail'].length + 1}`,
                  type: 'expend',
                  category: result['data']['category'],
                  name: result['data']['name'],
                  data: result['data']['data'],
                  commit: result['data']['commit'],
                  update_time: result['data']['update_time']
                })
                e['total_expend'] += result['data']['data'];
              }
            }
            return e;
          })
          break;
      }
    } else if (result['theme'] === '預算編列') {
      switch (this.allMonth.includes(result['data']['month'])) {
        // 當月第1筆
        case false:
          this.eachMonthBudget.push({
            total_budget: result['data']['data'],
            budget_detail: [
              {
                id: `${moment(result['data']['month']).format('YYYY-MM')}_bg_1`,
                type: 'budget',
                category: result['data']['category'],
                data: result['data']['data'],
                commit: result['data']['commit'],
                update_time: result['data']['update_time']
              },
            ],
            month: result['data']['month'],
          })
          break;
        // 當月第N筆
        case true:
          this.eachMonthBudget = this.eachMonthBudget.map(e => {
            if (e['month'] === result['data']['month']) {
              e['budget_detail'].push({
                id: `${moment(result['data']['month']).format('YYYY-MM')}_bg_${e['budget_detail'].length + 1}`,
                type: 'budget',
                category: result['data']['category'],
                data: result['data']['data'],
                commit: result['data']['commit'],
                update_time: result['data']['update_time']
              })
              e['total_budget'] += result['data']['data'];
            }
            return e;
          })
          break;
      }
    }
  }

  // 編輯資料
  editData(result) {
    if (result['theme'] === '收支紀錄') {
      // 找到對應資料並修正
      let date = result['data']['id'].split('_')[0];
      let type = result['data']['id'].split('_')[1];
      this.eachDayData = this.eachDayData.map(e => {
        if (e.date === date) {
          if (type === 'in') {
            // 修正該筆收入（以id找到該筆資料）
            e['income_detail'] = e['income_detail'].map(ele => {
              if (ele.id === result['data']['id']) {
                ele = {
                  id: result['data']['id'],
                  type: 'income',
                  category: result['data']['category'],
                  name: result['data']['name'],
                  data: result['data']['data'],
                  commit: result['data']['commit'],
                  update_time: result['data']['update_time']
                }
              }
              return ele;
            })
            // 重新計算總收入
            e['total_income'] = e['income_detail'].reduce((acc, cur) => {
              return acc + cur['data'];
            }, 0)
          } else if (type === 'ex') {
            // 修正該筆支出（以id找到該筆資料）
            e['expend_detail'] = e['expend_detail'].map(ele => {
              if (ele.id === result['data']['id']) {
                ele = {
                  id: result['data']['id'],
                  type: 'expend',
                  category: result['data']['category'],
                  name: result['data']['name'],
                  data: result['data']['data'],
                  commit: result['data']['commit'],
                  update_time: result['data']['update_time']
                }
              }
              return ele;
            })
            // 重新計算總支出
            e['total_expend'] = e['expend_detail'].reduce((acc, cur) => {
              return acc + cur['data'];
            }, 0)
          }
        }
        return e;
      })
      // 以上機制，目前無法更動日期和類型，要刪除原資料並重新新增一筆其他天的資料
      // [法一]在modal擋掉日期和類型編輯，並提示使用者
      // [法二]更改機制，使修正資料時可以更動日期和類型
    } else if (result['theme'] === '預算編列') {
      // 找到對應資料並修正
      let month = result['data']['id'].split('_')[0];
      this.eachMonthBudget = this.eachMonthBudget.map(e => {
        if (e.month === month) {
          // 修正該筆預算（以id找到該筆資料）
          e['budget_detail'] = e['budget_detail'].map(ele => {
            if (ele.id === result['data']['id']) {
              ele = {
                id: result['data']['id'],
                type: 'budget',
                category: result['data']['category'],
                data: result['data']['data'],
                commit: result['data']['commit'],
                update_time: result['data']['update_time']
              }
            }
            return ele;
          })
          // 重新計算總預算
          e['total_budget'] = e['budget_detail'].reduce((acc, cur) => {
            return acc + cur['data'];
          }, 0)
        }
        return e;
      })
      // 以上機制，目前無法更動月份和類型，要刪除原資料並重新新增一筆其他天的資料
      // [法一]在modal擋掉月份和類型編輯，並提示使用者
      // [法二]更改機制，使修正資料時可以更動日月份和類型
    }
  }

  // 刪除資料
  delete(data) {
    if (this.selectedTheme === '收支紀錄') {
      // 找到對應資料並刪除
      let date = data['id'].split('_')[0];
      let type = data['id'].split('_')[1];
      this.eachDayData = this.eachDayData.map(e => {
        e['have_data'] = true;
        if (e.date === date) {
          if (type === 'in') {
            e['income_detail'] = e['income_detail'].filter(el => el['id'] !== data['id']);
            // 重新計算總收入
            e['total_income'] = e['income_detail'].reduce((acc, cur) => {
              return acc + cur['data'];
            }, 0)
          } else if (type === 'ex') {
            e['expend_detail'] = e['expend_detail'].filter(el => el['id'] !== data['id']);
            // 重新計算總支出
            e['total_expend'] = e['expend_detail'].reduce((acc, cur) => {
              return acc + cur['data'];
            }, 0)
          }
          if (e['income_detail'].length === 0 && e['expend_detail'].length === 0) {
            e['have_data'] = false;
          }
        }
        return e;
      })

      // 如果是最後一筆，就刪除該日資料
      this.eachDayData = this.eachDayData.filter(e => e['have_data']);
    } else if (this.selectedTheme === '預算編列') {
      // 找到對應資料並刪除
      let month = data['id'].split('_')[0];
      this.eachMonthBudget = this.eachMonthBudget.map(e => {
        e['have_data'] = true;
        if (e.month === month) {
          e['budget_detail'] = e['budget_detail'].filter(el => el['id'] !== data['id']);
          // 重新計算總預算
          e['total_budget'] = e['budget_detail'].reduce((acc, cur) => {
            return acc + cur['data'];
          }, 0)
          if (e['budget_detail'].length === 0) {
            e['have_data'] = false;
          }
        }
        return e;
      })

      // 如果是最後一筆，就刪除該月資料
      this.eachMonthBudget = this.eachMonthBudget.filter(e => e['have_data']);
    }

    // 更新資料
    this.updateData();
  }

  // 更新資料
  updateData() {
    if (this.selectedTheme === '收支紀錄') {
      // console.log(this.eachDayData)
      localStorage.setItem('eachDayData', JSON.stringify(this.eachDayData));
    } else if (this.selectedTheme === '預算編列') {
      // console.log(this.eachMonthBudget)
      localStorage.setItem('eachMonthBudget', JSON.stringify(this.eachMonthBudget));
    }
    this.getData(); // 重新跑出頁面資料
  }

  // 開啟/結束編輯
  editControl() {
    this.editStatus = !this.editStatus;
  }

  // 更改檢視模式
  changeMode() {
    this.viewMode = this.viewMode === 'card' ? 'table' : 'card';
  }
}
