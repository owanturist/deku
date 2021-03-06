export function noop(): void {
    return;
}

export function isNil(value: any): value is void {
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

// tslint:disable-next-line:ban-types
export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}
