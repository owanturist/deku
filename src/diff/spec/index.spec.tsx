import deku from 'deku';

import {
    createText,
    createEmpty
} from '../../vnode';
import {
    setAttribute,
    removeAttribute,
    insertChild,
    removeChild,
    updateChildren,
    replaceNode,
    removeNode,
    updateChild,
    updateThunk,
    insertBefore
} from '../actions';
import {
    diffAttributes,
    diffChildren,
    diffVnodes
} from '..';


describe('Diff', () => {
    describe('diffAttributes()', () => {
        it('add attribute action', () => {
            expect(
                diffAttributes(
                    <div />,
                    <div color='red' />
                )
            ).toEqual([
                setAttribute('color', 'red', undefined)
            ]);
        });

        it('update attribute action', () => {
            expect(
                diffAttributes(
                    <div color='red'/>,
                    <div color='blue' />
                )
            ).toEqual([
                setAttribute('color', 'blue', 'red')
            ]);
        });

        it('remove attribute action', () => {
            expect(
                diffAttributes(
                    <div color='red'/>,
                    <div />
                )
            ).toEqual([
                removeAttribute('color', 'red')
            ]);
        });

        it('update attribute action with false', () => {
            expect(
                diffAttributes(
                    <div color='red'/>,
                    <div color={false} />
                )
            ).toEqual([
                setAttribute('color', false, 'red')
            ]);
        });

        it('update attribute action with null', () => {
            expect(
                diffAttributes(
                    <div color='red'/>,
                    <div color={null} />
                )
            ).toEqual([
                setAttribute('color', null, 'red')
            ]);
        });

        it('update attribute action with undefined', () => {
            expect(
                diffAttributes(
                    <div color='red'/>,
                    <div color={undefined} />
                )
            ).toEqual([
                setAttribute('color', undefined, 'red')
            ]);
        });

        it('no actions for same attribute values', () => {
            expect(
                diffAttributes(
                    <div color='red'/>,
                    <div color='red' />
                )
            ).toEqual([]);
        });

        it('update input value with zero value', () => {
            expect(
                diffAttributes(
                    <input value='red'/>,
                    <input value={0} />
                )
            ).toEqual([
                setAttribute('value', 0, 'red')
            ]);
        });
    });

    describe('diffChildren()', () => {
        it('insert text', () => {
            expect(
                diffChildren(
                    <div />,
                    <div>foo</div>,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    insertChild(createText('foo'), 0, 'root.0')
                ])
            );
        });

        it('update text', () => {
            expect(
                diffChildren(
                    <div>foo</div>,
                    <div>bar</div>,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    updateChild(0, [
                        setAttribute('nodeValue', 'bar', 'foo')
                    ])
                ])
            );
        });

        it('insert element', () => {
            expect(
                diffChildren(
                    <div />,
                    <div><span /></div>,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    insertChild(<span />, 0, 'root.0')
                ])
            );
        });

        it('remove element', () => {
            expect(
                diffChildren(
                    <div><span /></div>,
                    <div />,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    removeChild(0)
                ])
            );
        });

        it('remove element with null', () => {
            expect(
                diffChildren(
                    <div><span /></div>,
                    <div>{null}</div>,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    updateChild(0, [
                        replaceNode(<span />, createEmpty(), 'root.0')
                    ])
                ])
            );
        });

        it('updated element with null', () => {
            expect(
                diffChildren(
                    <div>{null}</div>,
                    <div>{null}</div>,
                    'root'
                )
            ).toEqual(
                updateChildren([])  // TODO: replace to empty list
            );
        });

        it('add element from null', () => {
            expect(
                diffChildren(
                    <div>{null}</div>,
                    <div><span /></div>,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    updateChild(0, [
                        replaceNode(createEmpty(), <span />, 'root.0')
                    ])
                ])
            );
        });

        it('move elements', () => {
            expect(
                diffChildren(
                    <ul>
                        <li key='first'></li>
                        <li key='second'></li>
                        <li key='third'></li>
                    </ul>,
                    <ul>
                        <li key='first'></li>
                        <li key='third'></li>
                        <li key='second'></li>
                    </ul>,
                    'root'
                )
            ).toEqual(
                updateChildren([
                    updateChild(0, [
                        updateChildren([])
                    ]),
                    updateChild(1, [
                        updateChildren([]),
                        insertBefore(3)
                    ]),
                    updateChild(2, [
                        updateChildren([]),
                        insertBefore(2)
                    ])
                ])
            );
        });
    });

    describe('diffVnodes()', () => {
        it('diffing the same nodes should bail', () => {
            const vnode = <div />;

            expect(
                diffVnodes(
                    vnode,
                    vnode,
                    'root'
                )
            ).toEqual([]);
        });

        it('diffing nodes with different types', () => {
            const prevVnode = <div />;
            const nextVnode = <span />;

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                replaceNode(prevVnode, nextVnode, 'root')
            ]);
        });

        it('diffing node with null', () => {
            const prevVnode = <div />;
            const nextVnode = null;

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                replaceNode(prevVnode, nextVnode, 'root')
            ]);
        });

        it('diffing with a current node as null', () => {
            const prevVnode = null;
            const nextVnode = <div />;

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                replaceNode(prevVnode, nextVnode, 'root')
            ]);
        });

        it('diffing node with undefined', () => {
            const prevVnode = <div />;
            const nextVnode = undefined;

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                removeNode(prevVnode)
            ]);
        });

        it('diffing text nodes', () => {
            const prevVnode = createText('foo');
            const nextVnode = createText('bar');

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                setAttribute('nodeValue', 'bar', 'foo')
            ]);
        });

        it('diffing two nodes should diff attributes then children', () => {
            const prevVnode = <div />;
            const nextVnode = <div name='Tom'><span /></div>;

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                setAttribute('name', 'Tom', undefined),
                updateChildren([
                    insertChild(<span />, 0, 'root.0')
                ])
            ]);
        });

        it('diffing thunks', () => {
            const RenderDiv = () => <div />;
            const RenderSpan = () => <span />;

            const first = <RenderDiv />;
            const second = <RenderDiv />;
            const third = <RenderSpan />;

            expect(
                diffVnodes(
                    first,
                    second,
                    'root'
                )
            ).toEqual([
                updateThunk(first, second, 'root')
            ]);

            expect(
                diffVnodes(
                    first,
                    third,
                    'root'
                )
            ).toEqual([
                replaceNode(first, third, 'root')
            ]);
        });
    });
});
