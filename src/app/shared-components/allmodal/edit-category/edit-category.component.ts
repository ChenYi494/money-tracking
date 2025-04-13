import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
// ng-zorro
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [NzDatePickerModule, FormsModule, NzSelectModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent {
  type = '';
  name = '';
  existData = [];

  constructor(
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public source: any,
  ) {
    this.type = source['type'];
    this.existData = source['data'].map(e => e['name']);
  }

  // 儲存
  submit() {
    if (this.existData.includes(this.name)) {
      alert('該分類名稱已存在');
    } else if(this.name.length > 4) {
      alert('品項名稱過長(至多四個文字)');
    } else {
      this.modalRef.close({ type: this.type, name: this.name });
    }
  }

  // 取消
  cancel() {
    this.modalRef.close();
  }
}
