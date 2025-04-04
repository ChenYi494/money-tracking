import { Component } from '@angular/core';
// component
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
// ng-zorro
import { NzHeaderComponent, NzLayoutComponent } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, NzHeaderComponent, NzLayoutComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
