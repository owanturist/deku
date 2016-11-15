export function isNil(value: any): boolean {
    return value == undefined; // tslint:disable-line triple-equals
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefined(value: any): value is undefined {
    return value === undefined;
}

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}

export function createElement(tagName: string): Element {
    switch (tagName) {
        case 'animate':
        case 'circle':
        case 'clipPath':
        case 'defs':
        case 'ellipse':
        case 'g':
        case 'line':
        case 'linearGradient':
        case 'mask':
        case 'path':
        case 'pattern':
        case 'polygon':
        case 'polyline':
        case 'radialGradient':
        case 'rect':
        case 'stop':
        case 'svg':
        case 'text':
        case 'tspan':
        case 'use': {
            return document.createElementNS('http://www.w3.org/2000/svg', tagName);
        }

        default: {
            return document.createElement(tagName);
        }
    }
}
