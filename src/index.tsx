import deku from './deku';

const Foo = ({ props }) => {
    return (
        <div>hello world {props.counter}</div>
    );
};

let counter = 0;

const contaner = document.getElementById('app');
const render = deku.createApp(contaner);

render(<Foo counter={counter}></Foo>, {});

setInterval(() => {
    render(<Foo counter={++counter}></Foo>, {})
}, 1000);
