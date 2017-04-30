import {
    createApp,
    Native,
    Text
} from './deku';

const Foo = (counter: number) => (
    Native('div', { id: 'foo' }, [
        Text('hello world '),
        Text(counter.toString())
    ])
);

let counter = 0;

const contaner = document.getElementById('app');
const render = createApp(contaner);

render(Foo(counter));

setInterval(() => {
    render(Foo(counter++))
}, 1000);
