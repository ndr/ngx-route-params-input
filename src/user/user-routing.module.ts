import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxRouteParamsInputComponent } from 'ngx-route-params-input';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [{
  path: ':userId',
  component: NgxRouteParamsInputComponent,
  data: {
    component: UserComponent,
    routeParams: {
      userId: 'userIdInput'
    },
    queryParams: {
      content: 'content'
    }
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
