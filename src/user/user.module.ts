import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './components/user/user.component';
import { NgxRouteParamsInputModule } from 'ngx-route-params-input';
import { NgxLetterImageAvatarModule } from 'ngx-letter-image-avatar';


@NgModule({
  declarations: [UserComponent],
  imports: [
    NgxLetterImageAvatarModule,
    CommonModule,
    UserRoutingModule,
    NgxRouteParamsInputModule
  ]
})
export class UserModule { }
