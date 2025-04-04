import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { zh_TW, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppService } from './services/app.service';
import { NZ_DATE_CONFIG } from 'ng-zorro-antd/i18n';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
const ngZorroConfig: NzConfig = {
  theme: { primaryColor: '#1890FF' },
};
registerLocaleData(zh);


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(zh_TW),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: (appService: AppService) => appService.get_ui_record,
      deps: [AppService],
      multi: true,
    },
    {
      provide: NZ_DATE_CONFIG,
      useValue: {
        firstDayOfWeek: 0, // Sunday as the first day of the week
      },
    },
    { provide: NZ_CONFIG, useValue: ngZorroConfig }
  ],
};
