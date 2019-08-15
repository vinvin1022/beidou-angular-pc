import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './routes/app-routing.module';
import { CommonCustomModule } from './modules/common-custom/common-custom.module';
import { LandingAuthorityService } from './service/landing-authority.service';
import { RequestService } from './service/request.service';
import { LoginGuard } from './guards/LoginGuard';
import { ResponseInterceptor } from './service/response-interceptor.service';
import { FilternewsPipe } from './pipe/filternews.pipe';
import { SelectAllService } from './service/select-all.service';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingCache } from './routes/app-routing-cache';
import { HomeModule } from './modules/home/home.module';
import { LoginModule } from './modules/login/login.module';
import { ConfirmModalService } from './service/confirm-modal.service';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    FilternewsPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // FormsModule,
    HttpClientModule,
    // NgZorroAntdModule,
    // ReactiveFormsModule,
    HomeModule,
    LoginModule,
    CommonCustomModule
  ],
  providers: [
    LandingAuthorityService, RequestService, LoginGuard, SelectAllService, ConfirmModalService,
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: AppRoutingCache }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
