import * as Counter from './Counter/State';
import {
    Msg,
    Model
} from './Types';

export const initialModel: Model = {
    firstCounter: Counter.initialModel,
    secondCounter: Counter.initialModel
};

export const update = (msg: Msg, model: Model): Model => {
    switch (msg.type) {
        case 'FIRST_COUNTER_MSG': {
            return {
                ...model,
                firstCounter: Counter.update(msg.payload, model.firstCounter)
            };
        }

        case 'SECOND_COUNTER_MSG': {
            return {
                ...model,
                secondCounter: Counter.update(msg.payload, model.secondCounter)
            };
        }
    }
};
