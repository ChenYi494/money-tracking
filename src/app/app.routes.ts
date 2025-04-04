import { Routes } from '@angular/router';
// 頁面
import { DataComponent } from './pages/data/data.component';
import { AnalyzeComponent } from './pages/analyze/analyze.component';
import { SystemComponent } from './pages/system/system.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'data', pathMatch: 'full' }, // 預設頁面重定向
  { path: 'data', component: DataComponent },
  { path: 'analyze', component: AnalyzeComponent },
  { path: 'system', component: SystemComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
