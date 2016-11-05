export function toArray<T>(array: T[]): T[] {
    const { length } = array;
    const newArray = new Array(length);
    let index = 0;

    while (index++ < length) {
        newArray[ index ] = array[ index ];
    }

    return newArray;
}
