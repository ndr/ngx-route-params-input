
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, SimpleChange, SimpleChanges, OnDestroy, AfterViewInit, ComponentRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { getAllRouteParams, getAllQueryParams } from './get-all-route-params';
import { filter } from 'rxjs/operators';
import { isDevMode } from '@angular/core';
import { getInputMap } from './get-input-map';

export interface IRouteParamsComponentData {
    component: any;
    routeParams?: {
        [param: string]: string;
    },
    queryParams?: {
        [param: string]: string;
    },
    [key: string]: any;
}


@Component({
    selector: 'ngx-route-params-input',
    template: '<template #routeParamsContainer></template>'
})
export class NgxRouteParamsInputComponent implements AfterViewInit, OnDestroy {

    public readonly libDataKey = 'ngxRouteParamsInput';

    @ViewChild('routeParamsContainer', { read: ViewContainerRef }) 
    public container;

    public readonly routeParamsDataKey = 'routeParams';
    public readonly queryParamsDataKey = 'queryParams';

    private propParams: any;
    public componentConstructor: any;

    public componentRef: ComponentRef<any>;
    private isNotFirstChangeCollection = {};

    private data: IRouteParamsComponentData;

    public dataSubscription: Subscription;
    public paramSubscription: Subscription;


    constructor(private route: ActivatedRoute,
        private router: Router,
        private resolver: ComponentFactoryResolver) {}

    ngAfterViewInit(): void {
        this.subscribeToDataChange();
    }

    ngOnDestroy(): void {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
        if (this.paramSubscription) {
            this.paramSubscription.unsubscribe();
        }
    }

    private subscribeToDataChange(): void {
        this.dataSubscription = this.route.data.subscribe((data: any) => {
            const routeInputData = data && data[this.libDataKey] || {};
            this.handleData(routeInputData);
            this.handleParams();
        });
        this.paramSubscription = this.router.events.pipe(
            filter(e => e instanceof NavigationEnd)
            ).subscribe(() => {
                this.handleParams();
        });
    }

    private handleData(data: IRouteParamsComponentData): void {
        if (this.componentConstructor !== data.component) {
            this.componentConstructor = data.component;
            this.container.clear();
            if (!this.componentConstructor) {
                return;
            }
            const factory = this.resolver.resolveComponentFactory(this.componentConstructor);
            this.componentRef = this.container.createComponent(factory);
            this.isNotFirstChangeCollection = {};
        }

        this.data = data;
    }


    private getRouteParamsForInputPass(): any {
        const passRouteParamsInstructions = this.data[this.routeParamsDataKey] || {};
        const passQueryParamsInstructions = this.data[this.queryParamsDataKey] || {};

        const routeParams = getAllRouteParams(this.router);
        const queryParams = getAllQueryParams(this.router);

        const routeInputParams = {};
        const queryInputParams = {};

        Object.keys(passRouteParamsInstructions).forEach(key => {
            routeInputParams[passRouteParamsInstructions[key]] = routeParams[key];
        });
        Object.keys(passQueryParamsInstructions).forEach(key => {
          queryInputParams[passQueryParamsInstructions[key]] = queryParams[key];
        });
        return {
          ...queryInputParams,
          ...routeInputParams
        };
    }

    private mapInputParams(paramsFromRouter): any {
        const propertyParams = {};
        const inputMap = getInputMap(this.componentConstructor);
        Object.keys(paramsFromRouter).forEach(routerKey => {
            const property = inputMap[routerKey];
            if (!property) {
                if (isDevMode()) {
                    window?.console?.error(`NgxRouteParamsInput: You are trying to pass "${routerKey}" as @Input() param, which is not exist at ${this.componentConstructor.name}.`);
                }
            } else {
                propertyParams[property] = paramsFromRouter[routerKey];
            }
        });
        return propertyParams;
    }

    private handleParams(): void {
        if (!this.componentConstructor) {
            return;
        }
        const oldInputParams = this.propParams || {};
        const paramsFromRouter = this.getRouteParamsForInputPass();
        this.propParams = this.mapInputParams(paramsFromRouter);

        const removedParams = Object.keys(oldInputParams)
            .filter(oldParam => {
                return Object.keys(this.propParams).includes(oldParam);
            })
            .reduce((acc, paramName) => {
                acc[paramName] = null;
                return acc;
            }, {});

        const changes: SimpleChanges = {};

        Object.keys({
            ...removedParams,
            ...this.propParams
        }).forEach(inputParam => {
            const firstChange = !this.isNotFirstChangeCollection[inputParam];
            this.componentRef.instance[inputParam] = this.propParams[inputParam];
            this.isNotFirstChangeCollection[inputParam] = true;
            if (oldInputParams[inputParam] !== this.propParams[inputParam]) {
              changes[inputParam] = new SimpleChange(oldInputParams[inputParam], this.propParams[inputParam], firstChange);
            }
        });

        if (typeof this.componentRef?.instance['ngOnChanges'] === 'function' && Object.keys(changes).length) {
            this.componentRef.instance['ngOnChanges'](changes);
        }

        this.componentRef.changeDetectorRef.detectChanges();
    }

}