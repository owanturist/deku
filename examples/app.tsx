import deku from '../src/deku';

const container = document.getElementById('app-root');

function Foo() {
    return (
        <div className='class' key='sad' onClick={() => {console.log('hello')}}>Hello world!</div>
    );
}

const render = deku.createApp(container);

render(
    <Foo />
);
