export function forEachArray<T>(
    callbackfn: (currentValue: T, currentIndex: number, array: T[]) => void,
    array: T[]
): void {
    let index = array.length;

    while (index--) {
        callbackfn(array[ index ], index, array);
    }
}
