import {
    Msg,
    Model
} from './Types';

export const initialModel: Model = Model(0);

export const update = (msg: Msg, model: Model): Model => {
    switch (msg.type) {
        case 'INCREMENT': {
            return model + 1;
        }

        case 'DECREMENT': {
            return model - 1;
        }
    }
};
