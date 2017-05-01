import {
    beginnerProgram
} from './app';
import {
    Vnode,
    Native,
    Text
} from './vnode';

type Msg
    = Increment
    | Decrement
    ;

interface Increment {
    type: 'INCREMENT';
}
const Increment = (): Increment => ({
    type: 'INCREMENT'
});

interface Decrement {
    type: 'DECREMENT';
}
const Decrement = (): Decrement => ({
    type: 'DECREMENT'
});

interface Model {
    counter: number;
}
const Model = (counter: number): Model => ({
    counter
});

const view = (model: Model): Vnode => (
    Native('div', { id: 'foo' }, [
        Text('hello world '),
        Text(model.counter.toString()),
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

const update = (msg: Msg, model: Model): Model => {
    switch (msg.type) {
        case 'INCREMENT': {
            return {
                ...model,
                counter: model.counter + 1
            };
        }

        case 'DECREMENT': {
            return {
                ...model,
                counter: model.counter - 1
            };
        }
    }
};

beginnerProgram<Msg, Model>({
    model: Model(0),
    view,
    update
}, document.getElementById('app'));
