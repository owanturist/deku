export function indexOf<T>(
    searchElement: T,
    fromIndex: number,
    array: T[]
): number {
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
