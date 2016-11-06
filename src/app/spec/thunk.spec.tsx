import * as deku from '../..';
import * as trigger from 'trigger-event';
import { spy } from 'sinon';
import { assert } from 'chai';

import {
    createApp
} from 'app';

describe('App thunk', () => {
    const spyFunc = spy();

    afterEach(() => {
        spyFunc.reset();
    });

    it('rendering and updating thunks', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            render: (model) => (
                <div name={model.props.name} />
            )
        };

        render(<Component name='Tom' />);
        render(<Component name='Bob' />);
        assert.equal(el.innerHTML, `<div name="Bob"></div>`, 'thunk updated');
    });

    it('rendering and updating plain function thunks', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component = (model) => <div name={model.props.name} />;

        render(<Component name='Tom' />);
        render(<Component name='Bob' />);
        assert.equal(el.innerHTML, `<div name="Bob"></div>`, 'thunk updated');
    });

    it('calling dispatch', () => {
        let Component: any = {
            render: ({ dispatch }) => (
                <button onClick={() => dispatch({ type: 'CLICK' })}>Click</button>
            )
        };

        let el = document.createElement('div');
        document.body.appendChild(el);

        let render = createApp(el, spyFunc);

        render(<Component />);
        trigger(el.querySelector('button'), 'click');
        assert.deepEqual(
            spyFunc.args,
            [
                [{ type: 'CLICK' }]
            ],
            'Action received'
        );

        document.body.removeChild(el);
    });

    it('accessing context', () => {
        let state = {
            name: 'Tom'
        };
        let Component: any = {
            render: ({ context }) => {
                assert.equal(context, state, 'same object is used');
                return <div>{context.name}</div>;
            }
        };
        let el = document.createElement('div');
        let render = createApp(el);
        render(<Component />, state);
        assert.equal(el.innerHTML, '<div>Tom</div>');
    });

    it('swapping a thunks root element', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            render: (model) => (
                model.props.swap
                    ? <a />
                    : <b />
            )
        };

        render(<Component />);
        render(<Component swap />);
        assert.equal(el.innerHTML, `<a></a>`, 'thunk root element swapped');
    });

    it('rendering a thunk with props', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            render: (model) => <button>{model.props.text}</button>
        };

        render(<div><Component text='Reset' /></div>);
        assert.equal(el.innerHTML, '<div><button>Reset</button></div>', 'thunk rendered');

        render(<div><Component text='Submit' /></div>);
        assert.equal(el.innerHTML, '<div><button>Submit</button></div>', 'thunk updated');
    });

    it('rendering a thunk with children', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            render: ({ children }) => children[0]
        };

        render(
            <Component>
                <div>Hello World</div>
            </Component>
        );
        assert.equal(el.innerHTML, '<div>Hello World</div>', 'thunk rendered with children');
    });

    it('rendering a thunk with a path', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            render: ({ path }) => {
                assert.isOk(path, 'path is correct');
                return <div />;
            }
        };

        render(
            <div>
                <ul>
                    <li key='one'></li>
                    <li key='two'><Component /></li>
                    <li key='three'></li>
                </ul>
            </div>
        );
    });

    it('calling onCreate hook correctly', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            onCreate: spyFunc,
            render: () => <div />
        };

        render(<Component />);
        render(<Component />);
        assert.isTrue(spyFunc.calledOnce);
    });

    it('calling plain function onCreate hook correctly', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = m => <div />;

        Component.onCreate = spyFunc;

        render(<Component />);
        render(<Component />);
        assert.isTrue(spyFunc.calledOnce);
    });

    it('calling onUpdate hook correctly', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            onUpdate: ({ path, props }) => {
                assert.isOk(path, 'path available');
                assert.equal(props.name, 'Tom', 'props available');
            },
            render: m => <div />
        };

        render(<Component name='Bob' />);
        render(<Component name='Tom' />);
    });

    it('calling plain function onUpdate hook correctly', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = m => <div />;

        Component.onUpdate = ({ path, props }) => {
            assert.isOk(path, 'path available');
            assert.equal(props.name, 'Tom', 'props available');
        };

        render(<Component name='Bob' />);
        render(<Component name='Tom' />);
    });

    it('calling onRemove hook correctly', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = {
            onRemove: ({ path, props }) => {
                assert.isOk(path, 'path available');
                assert.equal(props.name, 'Tom', 'props available');
            },
            render: m => <div />
        };

        render(<Component name='Tom' />);
        render(<div />);
    });

    it('calling plain function onRemove hook correctly', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let Component: any = m => <div />;

        Component.onRemove = ({ path, props }) => {
            assert.isOk(path, 'path available');
            assert.equal(props.name, 'Tom', 'props available');
        };

        render(<Component name='Tom' />);
        render(<div />);
    });

    it('path should stay the same on when thunk is updated', () => {
        let el = document.createElement('div');
        let render = createApp(el);
        document.body.appendChild(el);
        let MyButton: any = {
            onUpdate({path}) {
                assert.equal(path, '0.0.0', 'onUpdate');
            },
            render({path, children}) {
                assert.equal(path, '0.0.0', 'onRender');
                return <button onClick={update}>{children}</button>;
            }
        };
        let MyWrapper: any = {
            render({path}) {
                assert.equal(path, '0', 'Wrapper onRender');
                return <div>
                    <MyButton>Hello World!</MyButton>
                </div>;
            }
        };
        let update = () => {
            render(<MyWrapper />);
        };
        update();
        trigger(el.querySelector('button'), 'click');
        document.body.removeChild(el);
    });

    it('path should stay the same on when thunk is replaced', () => {
        let el = document.createElement('div');
        let render = createApp(el);
        let Thunk: any = {
            render({path, children, props}) {
                assert.equal(path, props.expectedPath, 'onRender');
                return children[0] || <div />;
            }
        };
        render(<div><span /></div>);
        render(<div><Thunk expectedPath='0.0' /></div>);
        render(<div><span /></div>);
        render(<div></div>);
        render(<div><Thunk expectedPath='0.0'><Thunk expectedPath='0.0.0' /></Thunk></div>);
    });
});
