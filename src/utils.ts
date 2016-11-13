export function isNil(value: any): boolean {
    return value == undefined; // tslint:disable-line triple-equals
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefined(value: any): value is undefined {
    return value === undefined;
}
