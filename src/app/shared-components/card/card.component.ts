import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// rxjs
import { ReplaySubject } from 'rxjs';
// interface
import { CardSetting } from '../interface';
// ng-zorro
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
// component
import { CustomListComponent } from '../allmodal/custom-list/custom-list.component';
// config
import { analyze } from '../../shared-components/config';
// service
import { CenterService } from '../../services/center.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NzDrawerModule, CustomListComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  // 引入該元件傳遞的內容做設定
  @Input() cardSetting!: CardSetting;

  constructor(
    public drawerService: NzDrawerService,
    public centerSVC: CenterService
  ) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  // 開啟自定義modal
  openCustom() {
    this.centerSVC.isCustomStatus = true;
    // 取得點選的件資訊
    let info = {
      class: this.cardSetting.class,
      size: this.cardSetting.size
    }
    // 取得所有cfg內容
    let cfgs = analyze.filter(e => e['size'] === info.size);
    const drawerRef = this.drawerService.create({
      nzWidth: info.size === '2x1' ? '640px' : '320px',
      nzClosable: false,
      nzContent: CustomListComponent,
      nzContentParams: { cfgs },
    });

    // 取得更換結果
    drawerRef.afterClose.subscribe((data: { id: any }) => {
      if (data) {
        // 取得localstorage
        let local = this.centerSVC.get_all_page_cfg();
        local.forEach((e: any) => {
          e.page_configs.components.forEach((item: any) => {
            if (item.class == this.cardSetting.class) {
              item.id = data.id;
            }
          });
        });

        // 更新localstorage
        localStorage.setItem('cfg', JSON.stringify(local));
        this.centerSVC.updateCustom$.next(true);
      }

      this.centerSVC.isCustomStatus = false;
    })
  }

  openModal() { }
}
