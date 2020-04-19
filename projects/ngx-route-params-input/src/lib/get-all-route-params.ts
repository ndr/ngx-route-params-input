
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';


const getParamsFromSnapshot = (snap: ActivatedRouteSnapshot, isQueryParams = false, paramsObj = {}) => {
    paramsObj = {
        ...paramsObj,
        ...snap[isQueryParams ? 'queryParams' : 'params']
    };
    if (snap.firstChild) {
        paramsObj = getParamsFromSnapshot(snap.firstChild, isQueryParams, paramsObj);
    }

    return paramsObj;
}

const getRootSnapshotFromAnything = (anything: Router | ActivatedRoute | ActivatedRouteSnapshot) => {
    let rootSnapshot: ActivatedRouteSnapshot;
    if (anything instanceof Router) {
        rootSnapshot = anything.routerState.snapshot.root;
    } else if (anything instanceof ActivatedRouteSnapshot) {
        rootSnapshot = anything.root;
    } else if (anything instanceof ActivatedRoute) {
        rootSnapshot = anything.snapshot.root;
    }
    return rootSnapshot;
}

export const getAllRouteParams = (param: Router | ActivatedRoute | ActivatedRouteSnapshot) => {
    const snapshot = getRootSnapshotFromAnything(param);
    return getParamsFromSnapshot(snapshot, false);
};

export const getAllQueryParams = (param: Router | ActivatedRoute | ActivatedRouteSnapshot) => {
    const snapshot = getRootSnapshotFromAnything(param);
    return getParamsFromSnapshot(snapshot, true);
};