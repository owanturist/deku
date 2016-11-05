export function reduceArray<T>(
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
    initialValue: T,
    array: T[]
): T;

export function reduceArray<T, U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U,
    array: T[]
): U {
    const { length } = array;

    if (!length) {
        return initialValue;
    }

    for (let index = 0; index < length; index++) {
        initialValue = callbackfn(initialValue, array[ index ], index, array);
    }

    return initialValue;
}
