export function noop(): void {
    return;
}

export function isNil(value: any): value is void {
    return value == undefined; // tslint:disable-line triple-equals
}

export function isNull(value: any): value is void {
    return value === null;
}

export function isUndefined(value: any): value is void {
    return value === undefined;
}

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}
