export function isNil(value: any): boolean {
    return value == undefined; // tslint:disable-line triple-equals
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefined(value: any): value is undefined {
    return value === undefined;
}


export type ForEachCallback<T>
    = (currentValue: T, currentIndex: number, array: T[]) => void;

export function forEach<T>(callbackfn: ForEachCallback<T>, array: T[]): void {
    const { length } = array;

    for (let index = 0; index < length; index ++) {
        callbackfn(array[ index ], index, array);
    }
}

export function indexOf<T>(searchElement: T, fromIndex: number, array: T[]): number {
    const { length } = array;
    let index = fromIndex < 0 ? length + fromIndex : fromIndex;

    if (index >= length) {
        return -1;
    }

    while (index++ < length) {
        if (array[ index ] === searchElement) {
            return index;
        }
    }

    return -1;
}
