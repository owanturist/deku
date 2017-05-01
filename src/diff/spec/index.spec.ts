import {
    Native,
    Text
} from '../../vnode';
import {
    SetAttribute,
    RemoveAttribute,
    InsertChild,
    RemoveChild,
    UpdateChildren,
    ReplaceNode,
    RemoveNode,
    UpdateChild
} from '../changes';
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
                    Native('div', {}, []),
                    Native('div', { color: 'red' }, [])
                )
            ).toEqual([
                SetAttribute('color', 'red', undefined)
            ]);
        });

        it('update attribute action', () => {
            expect(
                diffAttributes(
                    Native('div', { color: 'red' }, []),
                    Native('div', { color: 'blue' }, [])
                )
            ).toEqual([
                SetAttribute('color', 'blue', 'red')
            ]);
        });

        it('remove attribute action', () => {
            expect(
                diffAttributes(
                    Native('div', { color: 'red' }, []),
                    Native('div', {}, [])
                )
            ).toEqual([
                RemoveAttribute('color', 'red')
            ]);
        });

        it('no actions for same attribute values', () => {
            expect(
                diffAttributes(
                    Native('div', { color: 'red' }, []),
                    Native('div', { color: 'red' }, [])
                )
            ).toEqual([]);
        });

        it('update input value with zero value', () => {
            expect(
                diffAttributes(
                    Native('input', { value: 'red' }, []),
                    Native('input', { value: 0 }, [])
                )
            ).toEqual([
                SetAttribute('value', 0, 'red')
            ]);
        });
    });

    describe('diffChildren()', () => {
        it('insert text', () => {
            expect(
                diffChildren(
                    Native('div', {}, []),
                    Native('div', {}, [
                        Text('foo')
                    ]),
                    'root'
                )
            ).toEqual(
                UpdateChildren([
                    InsertChild(Text('foo'), 0, 'root.0')
                ])
            );
        });

        it('update text', () => {
            expect(
                diffChildren(
                    Native('div', {}, [
                        Text('foo')
                    ]),
                    Native('div', {}, [
                        Text('bar')
                    ]),
                    'root'
                )
            ).toEqual(
                UpdateChildren([
                    UpdateChild(0, [
                        SetAttribute('nodeValue', 'bar', 'foo')
                    ])
                ])
            );
        });

        it('insert element', () => {
            expect(
                diffChildren(
                    Native('div', {}, []),
                    Native('div', {}, [
                        Native('span', {}, [])
                    ]),
                    'root'
                )
            ).toEqual(
                UpdateChildren([
                    InsertChild(Native('span', {}, []), 0, 'root.0')
                ])
            );
        });

        it('remove element', () => {
            expect(
                diffChildren(
                    Native('div', {}, [
                        Native('span', {}, [])
                    ]),
                    Native('div', {}, []),
                    'root'
                )
            ).toEqual(
                UpdateChildren([
                    RemoveChild(0)
                ])
            );
        });
    });

    describe('diffVnodes()', () => {
        it('diffing the same nodes should bail', () => {
            const vnode = Native('div', {}, []);

            expect(
                diffVnodes(
                    vnode,
                    vnode,
                    'root'
                )
            ).toEqual([]);
        });

        it('diffing nodes with different types', () => {
            const prevVnode = Native('div', {}, []);
            const nextVnode = Native('span', {}, []);

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                ReplaceNode(prevVnode, nextVnode, 'root')
            ]);
        });

        it('diffing node with undefined', () => {
            const prevVnode = Native('div', {}, []);
            const nextVnode = undefined;

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                RemoveNode(prevVnode)
            ]);
        });

        it('diffing text nodes', () => {
            const prevVnode = Text('foo');
            const nextVnode = Text('bar');

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                SetAttribute('nodeValue', 'bar', 'foo')
            ]);
        });

        it('diffing two nodes should diff attributes then children', () => {
            const prevVnode = Native('div', {}, []);
            const nextVnode = Native('div', { color: 'red' }, [
                Native('span', {}, [])
            ]);

            expect(
                diffVnodes(
                    prevVnode,
                    nextVnode,
                    'root'
                )
            ).toEqual([
                SetAttribute('color', 'red', undefined),
                UpdateChildren([
                    InsertChild(Native('span', {}, []), 0, 'root.0')
                ])
            ]);
        });
    });
});
