import { ChangeDetectorRef, Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// ng-zorro
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
// service
import { CenterService } from '../../../services/center.service';
import { CustomHostDirective } from '../../custom-host.directive';
// rxjs
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-custom-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomHostDirective, NzInputModule, NzIconModule, NzSegmentedModule],
  templateUrl: './custom-list.component.html',
  styleUrl: './custom-list.component.scss'
})
export class CustomListComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @ViewChild(CustomHostDirective) dynamicComponentLoader!: any;
  cfgs!: any[];
  size!: string;

  constructor(
    public renderer: Renderer2,
    public changeDetectorRef: ChangeDetectorRef,
    public drawerRef: NzDrawerRef<object>,
    public centerSVC: CenterService
  ) {}

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    const component_map = await this.dynamicComponentLoader.componentMap();
    const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;
    // 清除元件
    viewContainerRef.clear();

    this.cfgs.forEach((item: any, idx: number) => {
      // 動態產出模塊
      const componentRef = viewContainerRef.createComponent(component_map[item.type as keyof typeof component_map]);
      // 新增item class
      this.renderer.addClass(
        componentRef.location.nativeElement,
        item.size == '1x1' ? 'item1' : item.size == '1x2' ? 'item2' : 'item3'
      );
      // 設定input
      componentRef.instance['idx'] = idx;
      componentRef.instance['class'] = item.class;
      componentRef.instance['type'] = item.type;
      componentRef.instance['size'] = item.size;
      componentRef.instance['name'] = item.name;
      componentRef.instance['tips'] = item.tips;
      componentRef.instance['data'] = item.data;
      // 判斷是否為自定義列表
      componentRef.instance['edit'] = false;
      componentRef.instance['custom'] = true;
      // 在元素上直接綁定 click 事件
      this.renderer.listen(componentRef.location.nativeElement, 'click', () => {
        this.onItemClick(item); // 呼叫 onItemClick 方法，並傳遞 item
      });
    });
    // 重新同步動態生成子元件初始化數值
    this.changeDetectorRef.detectChanges();
  }

  // 點選後關閉drawer
  onItemClick(item: any) {
    this.drawerRef.close(item);
  }
}
