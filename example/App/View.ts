import {
    Vnode,
    Native,
    Text,
    Tagger
} from '../../src/vnode';

import * as Counter from './Counter/View';
import {
    Model,
    FirstCounterMsg,
    SecondCounterMsg
} from './Types';

export const view = (model: Model): Vnode => (
    Native('div', {}, [
        Native('h1', {}, [
            Text('Coutners')
        ]),
        Tagger(FirstCounterMsg, Counter.view(model.firstCounter)),
        Tagger(SecondCounterMsg, Counter.view(model.secondCounter))
    ])
);
