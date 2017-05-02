import * as Counter from './Counter/Types';

/*
 * --- MODEL ---
 */

export interface Model {
    firstCounter: Counter.Model;
    secondCounter: Counter.Model;
}
export const Model = (
    firstCounter: Counter.Model,
    secondCounter: Counter.Model
    ): Model => ({
    firstCounter,
    secondCounter
});

/*
 * --- MESSAGES ---
 */

export type Msg
    = FirstCounterMsg
    | SecondCounterMsg
    ;

export interface FirstCounterMsg {
    type: 'FIRST_COUNTER_MSG';
    payload: Counter.Msg;
}
export const FirstCounterMsg = (msg: Counter.Msg): FirstCounterMsg => ({
    type: 'FIRST_COUNTER_MSG',
    payload: msg
});

export interface SecondCounterMsg {
    type: 'SECOND_COUNTER_MSG';
    payload: Counter.Msg;
}
export const SecondCounterMsg = (msg: Counter.Msg): SecondCounterMsg => ({
    type: 'SECOND_COUNTER_MSG',
    payload: msg
});

