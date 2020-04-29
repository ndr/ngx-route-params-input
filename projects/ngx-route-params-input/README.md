# NgxRouteParamsInput

**NgxRouteParamsInput** allows to use angular router params and query params as component @Input() without need to subscribe to router events in each component, e.g.

Works with Angular 9 (and some of latest 8.X.X versions, older - not guaranteed)

## Instruction:

1. Install lib:
```bash
npm install --save ngx-route-params-input
```
or via yarn:
```bash
yarn add ngx-route-params-input
```

2. Import NgxRouteParamsInputModule to your module

```typescript
import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { NgxRouteParamsInputModule } from 'ngx-route-params-input';

@NgModule({
  ...,
  imports: [
    ...
    NgxRouteParamsInputModule,
  ]
})
export class UserModule { }
```
3. In routing module, change the component you want to get router params as @Inputs()
to **NgxRouteParamsInputComponent** and pass component and data you want to transfer as route data config's special parameter **ngxRouteParamsInput**:
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
    ngxRouteParamsInput: {
      component: UserComponent,
      routeParams: {
        userId: 'userIdInput'
      },
      queryParams: {
       content: 'content'
      }
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

Route data field '**ngxRouteParamsInput**' structure:
```typescript
export interface IRouteParamsComponentData {
    component: any; // component you want to render and pass props to
    routeParams?: any; // route params you want to pass
    queryParams?: any; // query params you want to pass
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
    ngxRouteParamsInput: {
      component: UserComponent,
      routeParams: {
        userId: 'userIdInput',
        iAmRouteParam: 'iAmInputParam'
      },
      queryParams: {
        content: 'content'
      }
    }
  }
}];
```
will pass **"userId"**, **iAmRouteParam** route params and **"content"** query param as
```typescript
@Input()
userIdInput: string;

@Input()
content: string

@Input('iAmInputParam')
componentPropertyWithOtherName: string

```
If there query and route params refers to the same input param, the route param will be passed and the query param will be ignored

## Example (Demo):

https://stackblitz.com/edit/angular-v8hdug?embed=1&file=src/app/user/user-routing.module.ts
