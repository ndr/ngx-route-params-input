
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, SimpleChanges, SimpleChange, OnDestroy, AfterViewInit, ComponentRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { getAllRouteParams, getAllQueryParams } from './get-all-route-params';
import { filter } from 'rxjs/operators';


export interface IRouteParamsComponentData {
    component: any;
    routeParams?: any;
    queryParams?: any;
    [key: string]: any;
}

@Component({
    selector: 'ngx-route-params-input',
    template: '<template #routeParamsContainer></template>'
})
export class NgxRouteParamsInputComponent implements AfterViewInit, OnDestroy {

    @ViewChild('routeParamsContainer', { read: ViewContainerRef }) 
    public container;

    public readonly routeParamsDataKey = 'routeParams';
    public readonly queryParamsDataKey = 'queryParams';

    private inputParams: any;
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
        this.dataSubscription = this.route.data.subscribe((data: IRouteParamsComponentData) => {
            this.handleData(data);
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

    private handleParams(): void {
        const oldInputParams = this.inputParams || {};
        this.inputParams = this.getRouteParamsForInputPass();

        const removedParams = Object.keys(oldInputParams)
            .filter(oldParam => {
                return Object.keys(this.inputParams).includes(oldParam);
            })
            .reduce((acc, paramName) => {
                acc[paramName] = null;
                return acc;
            }, {});

        const changes: SimpleChanges = {};

        Object.keys({
            ...removedParams,
            ...this.inputParams
        }).forEach(inputParam => {
            const firstChange = !this.isNotFirstChangeCollection[inputParam];
            this.componentRef.instance[inputParam] = this.inputParams[inputParam];
            this.isNotFirstChangeCollection[inputParam] = true;
            if (oldInputParams[inputParam] !== this.inputParams[inputParam]) {
              changes[inputParam] = new SimpleChange(oldInputParams[inputParam], this.inputParams[inputParam], firstChange);
            }
        });

        if (typeof this.componentRef.instance['ngOnChanges'] === 'function') {
            this.componentRef.instance['ngOnChanges'](changes);
        }

        this.componentRef.changeDetectorRef.detectChanges();
    }
}