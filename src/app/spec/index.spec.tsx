import * as deku from '../..';
import { assert } from 'chai';

import {
    createApp
} from 'app';

describe('App', () => {
    it('rendering elements', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        render(<span />);
        assert.equal(el.innerHTML, '<span></span>', 'rendered');

        render(<span name='Tom' />);
        assert.equal(el.innerHTML, '<span name="Tom"></span>', 'attributed added');

        render(<div><span /></div>);
        assert.equal(el.innerHTML, '<div><span></span></div>', 'root replaced');

        render(<div><div /></div>);
        assert.equal(el.innerHTML, '<div><div></div></div>', 'child replaced');

        render();
        assert.equal(el.innerHTML, '', 'root removed');

        render(<div>Hello</div>);
        assert.equal(el.innerHTML, '<div>Hello</div>', 'root added');
    });

    it('moving elements using keys', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        render(
            <div>
                <span id='1' />
                <span id='2' key='foo' />
                <span id='3' />
            </div>
        );

        let span = el.childNodes[0].childNodes[1];

        render(
            <div>
                <span id='2' key='foo' />
                <span id='1' />
                <span id='3' />
            </div>
        );

        assert.equal(
            el.innerHTML,
            `<div><span id="2"></span><span id="1"></span><span id="3"></span></div>`,
            'elements rearranged'
        );

        assert.equal(
            span,
            el.childNodes[0].childNodes[0],
            'element is moved'
        );
    });

    it('emptying the container', () => {
        let el = document.createElement('div');
        el.innerHTML = '<div></div>';
        let render = createApp(el);
        render(<span></span>);
        assert.equal(
            el.innerHTML,
            '<span></span>',
            'container emptied'
        );
    });

    it('context should be passed down all elements', () => {
        let Form: any = {
            render() {
                return <div>
                    <h2>My form</h2>
                    <div>
                        <Button label='press me!' />
                    </div>
                </div>;
            }
        };
        let Button: any = {
            render({ context }) {
                assert.equal(context.hello, 'there');
                return <button>Submit</button>;
            }
        };
        let el = document.createElement('div');
        let render = createApp(el);

        render(<Form />, { hello: 'there' });
    });

    it('context should be passed down across re-renders', () => {
        let Form: any = {
            render() {
                return <div><Button /></div>;
            }
        };
        let Button: any = {
            render({ context }) {
                assert.equal(context, 'the context', 'context is passed down');
                return <button>Submit</button>;
            }
        };
        let el = document.createElement('div');
        let render = createApp(el);

        render(<Form />, 'the context');
        render(<Form />, 'the context');
    });

    it('rendering numbers as text elements', () => {
        let el = document.createElement('div');
        let render = createApp(el);
        render(<span>{5}</span>);
        assert.equal(
            el.innerHTML,
            '<span>5</span>',
            'number rendered correctly'
        );
    });

    it('rendering zero as text element', () => {
        let el = document.createElement('div');
        let render = createApp(el);
        render(<span>{0}</span>);
        assert.equal(
            el.innerHTML,
            '<span>0</span>',
            'zero rendered correctly'
        );
    });

    it('rendering the same node', () => {
        let el = document.createElement('div');
        let render = createApp(el);
        let node = <div></div>;
        render(node);
        render(node);
        assert.equal(
            el.innerHTML,
            '<div></div>',
            'samenode is handled'
        );
    });

    it('context should be passed down across re-renders even after disappearance', () => {
        let Form: any = {
            render({ props }) {
                return <div>{props.visible ? <Button /> : []}</div>;
            }
        };
        let Button: any = {
            render({ context }) {
                assert.equal(context, 'the context', 'context is passed down');
                return <button>Submit</button>;
            }
        };
        let el = document.createElement('div');
        let render = createApp(el);

        render(<Form visible />, 'the context');
        render(<Form />, 'the context');
        render(<Form visible />, 'the context');
    });

    it('#339 - removing nodes that contain a text node', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        let ViewOne: any = {
            render: model => <div>Hi!</div>
        };

        let ViewTwo: any = {
            render: model => {
                let r = Date.now().toString() + 'dh';
                return <a>{r}</a>;
            }
        };

        render(<ViewOne />);
        render(<ViewTwo />);
    });

    it('#366 - cached vnodes for thunks are correct', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        const data = [
            { id: 1, title: 'la french' },
            { id: 2, title: 'the homesman' },
            { id: 3, title: 'mr. turner' }
        ];

        let Card: any = {
            render: ({ props }) => {
                return <li id={props.id}>
                    <div>{props.title}</div>
                </li>;
            }
        };

        let App: any = {
            render() {
                return <ul id='strap-list'>
                    {data.map((card) => <Card
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        />)}
                </ul>;
            }
        };

        let vnode = <App />;
        render(vnode);

        let ul = vnode.state.vnode;

        assert.notEqual(
            ul.children[0].state.vnode,
            ul.children[1].state.vnode
        );
    });

    it('rendering and updating null', () => {
        let el = document.createElement('div');
        let render = createApp(el);

        render(
            <div>
                <div key='one'></div>
                <div key='two'></div>
            </div>
        );
        render(
            <div>
                <div key='one'></div>
                {null}
                <div key='two'></div>
            </div>
        );
        assert.equal(el.innerHTML, '<div><div></div><noscript></noscript><div></div></div>', 'empty node added');

        render(
            <div>
                <div key='one'></div>
                <div key='two'></div>
                {null}
            </div>
        );
        assert.equal(el.innerHTML, '<div><div></div><div></div><noscript></noscript></div>', 'empty node updated');

        render(
            <div>
                <div key='one'></div>
                <div key='two'></div>
            </div>
        );
        assert.equal(el.innerHTML, '<div><div></div><div></div></div>', 'empty node updated');
    });
});
