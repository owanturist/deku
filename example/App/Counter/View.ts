import {
    Vnode,
    Native,
    Text
} from '../../../src/vnode';

import {
    Model,
    Decrement,
    Increment
} from './Types';

export const view = (model: Model): Vnode => (
    Native('div', {}, [
        Text('hello world '),
        Text(model.toString()),
        Native('div', {}, [
            Native('button', {
                onClick: Decrement
            }, [
                Text('-')
            ]),
            Native('button', {
                onClick: Increment
            }, [
                Text('+')
            ])
        ])
    ])
);
