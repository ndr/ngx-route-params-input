# NgxRouteParamsInput

**NgxRouteParamsInput** allows to use angular router params and query params as component @Input() without need to subscribe to router events in each component, e.g.

Works only with Angular Ivy (angular 9 by default)

## Without NgxRouteParamsInput:

```typescript
// routing module
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [{
  path: ':userId',
  component: UserComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
```

```typescript
// component
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, OnDestroy {

  public userId: string;
  public content: string

  private paramSubscription: Subscription;
  private querySubscription: Subscription;
    
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paramSubscription = this.route.params.subscribe(el => {
      this.userId = el.userId;
    });

    this.querySubscription = this.route.queryParams.subscribe(el => {
      this.content = el.content;
    });
  }

  ngOnDestroy(): void {
      this.paramSubscription.unsubscribe();
      this.querySubscription.unsubscribe();
  }
}
```

## With NgxRouteParamsInput:

1. Import NgxRouteParamsInputModule to your module

```typescript
import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { NgxRouteParamsInputModule } from 'ngx-route-params-input';

@NgModule({
  ...,
  imports: [
    ...
    NgxLetterImageAvatarModule,
  ]
})
export class UserModule { }
```
1. In routing module, change the component you want to get router params as @Inputs()
to **NgxRouteParamsInputComponent** and pass component and data you want to transfer as route data config:
```typescript
// routing module
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
```
```typescript
// component code:
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {

  @Input()
  public userIdInput: string;

  @Input()
  public content: string;

}
```

## Documentation:

Route data field structure:
```typescript
export interface IRouteParamsComponentData {
    component: any; // component you want to render and pass props to
    routeParams?: any; // route params you want to pass
    queryParams?: any; // query params you want to pass
    [key: string]: any; // any other data you are using in your app
}
```
**routeParams** and **queryParams** has the following schema:
{
    [paramName: string]: [inputName: string]
},
e.g. the following code:
```typescript
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
```
will pass **"userId"** route param and **"content"** query param as
```typescript
@Input()
userIdInput: string;

@Input()
content: string
```
If there query and route params refers to the same input param, the route param will be passed and the query param will be ignored

## Example (Demo):

https://stackblitz.com/edit/angular-v8hdug?embed=1&file=src/app/user/user-routing.module.ts