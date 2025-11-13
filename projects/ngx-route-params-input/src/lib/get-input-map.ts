const JIT_PROP_DECORATORS_KEY = '__prop__metadata__';

const addPropName = (map: any, inputName: string, propName: string) => {
    if (!map[inputName]) {
      map[inputName] = [];
    }
    map[inputName].push(propName);
    return map;
  }

const getInputMapAot = (componentConstructor: any) => {
    const map = {};
    const componentPropDecorators = componentConstructor.propDecorators;

    Object.keys(componentPropDecorators).forEach(key => {
        if (componentPropDecorators[key][0] && componentPropDecorators[key][0]?.type?.prototype?.ngMetadataName === 'Input') {
            const propName = key;
            const inputName = (componentPropDecorators[key][0]?.args && componentPropDecorators[key][0]?.args[0]) || key;
            addPropName(map, inputName, propName);
        }
    });
    return map;
}

const getInputMapJit = (componentConstructor: any) => {
    const map = {};
    const propMetadata = componentConstructor[JIT_PROP_DECORATORS_KEY];

    Object.keys(propMetadata).forEach(key => {
        if (propMetadata[key][0] && propMetadata[key][0]?.__proto__?.ngMetadataName === 'Input') {
            const propName = key;
            const inputName = (propMetadata[key][0] && propMetadata[key][0].bindingPropertyName) || key;
            addPropName(map, inputName, propName);
        }
    });

    return map;
}

const getInputMapOptimized = (componentConstructor: any) => {
    const map = {};
    const declaredInputs = (componentConstructor['ɵcmp']?.declaredInputs || componentConstructor['ɵcmp']?.inputs);

    Object.keys(declaredInputs).forEach(key => {
        const inputName = key;
        const propName = declaredInputs[key];
        addPropName(map, inputName, propName);
    });

    return map;
}

export const getInputMap = (componentConstructor: any) => {
    if (!componentConstructor) {
        return {};
    }

    // Try different metadata extraction methods based on Angular version and compilation mode
    // These methods support Angular 9-19 with both AOT and JIT compilation

    // Ivy optimized mode (Angular 9+ with Ivy enabled) - most common in modern Angular
    if (componentConstructor['ɵcmp']?.declaredInputs || componentConstructor['ɵcmp']?.inputs) {
        return getInputMapOptimized(componentConstructor);
    }

    // AOT compilation mode (older Angular versions)
    if (componentConstructor.propDecorators) {
        return getInputMapAot(componentConstructor);
    }

    // JIT compilation mode (development/runtime metadata)
    if (componentConstructor[JIT_PROP_DECORATORS_KEY]) {
        return getInputMapJit(componentConstructor);
    }

    return {};
}