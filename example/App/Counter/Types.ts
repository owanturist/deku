/*
 * --- MODEL ---
 */

export type Model = number;
export const Model = (count: number): Model => count;

/*
 * --- MESSAGES ---
 */

export type Msg
    = Increment
    | Decrement
    ;

export interface Increment {
    type: 'INCREMENT';
}
export const Increment = (): Increment => ({
    type: 'INCREMENT'
});

export interface Decrement {
    type: 'DECREMENT';
}
export const Decrement = (): Decrement => ({
    type: 'DECREMENT'
});
