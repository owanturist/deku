import test from 'ava';

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

test('diffAttributes(): add attribute action', (t) => {
    t.deepEqual(
        diffAttributes(
            Native('div', {}, []),
            Native('div', { color: 'red' }, [])
        ),
        [
            SetAttribute('color', 'red', undefined)
        ]
    );
});

test('diffAttributes(): update attribute action', (t) => {
    t.deepEqual(
        diffAttributes(
            Native('div', { color: 'red' }, []),
            Native('div', { color: 'blue' }, [])
        ),
        [
            SetAttribute('color', 'blue', 'red')
        ]
    );
});

test('diffAttributes(): remove attribute action', (t) => {
    t.deepEqual(
        diffAttributes(
            Native('div', { color: 'red' }, []),
            Native('div', {}, [])
        ),
        [
            RemoveAttribute('color', 'red')
        ]
    );
});

test('diffAttributes(): no actions for same attribute values', (t) => {
    t.deepEqual(
        diffAttributes(
            Native('div', { color: 'red' }, []),
            Native('div', { color: 'red' }, [])
        ),
        []
    );
});

test('diffAttributes(): no actions for same attribute values', (t) => {
    t.deepEqual(
        diffAttributes(
            Native('input', { value: 'red' }, []),
            Native('input', { value: 0 }, [])
        ),
        [
                SetAttribute('value', 0, 'red')
        ]
    );
});

test('diffChildren(): insert text', (t) => {
    t.deepEqual(
        diffChildren(
            Native('div', {}, []),
            Native('div', {}, [
                Text('foo')
            ]),
            'root'
        ),
        UpdateChildren([
            InsertChild(Text('foo'), 0, 'root.0')
        ])
    );
});

test('diffChildren(): update text', (t) => {
    t.deepEqual(
        diffChildren(
            Native('div', {}, [
                Text('foo')
            ]),
            Native('div', {}, [
                Text('bar')
            ]),
            'root'
        ),
        UpdateChildren([
            UpdateChild(0, [
                SetAttribute('nodeValue', 'bar', 'foo')
            ])
        ])
    );
});

test('diffChildren(): insert element', (t) => {
    t.deepEqual(
        diffChildren(
            Native('div', {}, []),
            Native('div', {}, [
                Native('span', {}, [])
            ]),
            'root'
        ),
        UpdateChildren([
            InsertChild(Native('span', {}, []), 0, 'root.0')
        ])
    );
});

test('diffChildren(): remove element', (t) => {
    t.deepEqual(
        diffChildren(
            Native('div', {}, [
                Native('span', {}, [])
            ]),
            Native('div', {}, []),
            'root'
        ),
        UpdateChildren([
            RemoveChild(0)
        ])
    );
});

test('diffVnodes(): diffing the same nodes should bail', (t) => {
    const vnode = Native('div', {}, []);

    t.deepEqual(
        diffVnodes(vnode, vnode, 'root'),
        []
    );
});

test('diffVnodes(): diffing nodes with different types', (t) => {
    const prevVnode = Native('div', {}, []);
    const nextVnode = Native('span', {}, []);

    t.deepEqual(
        diffVnodes(prevVnode, nextVnode, 'root'),
        [
            ReplaceNode(prevVnode, nextVnode, 'root')
        ]
    );
});

test('diffVnodes(): diffing node with undefined', (t) => {
    const prevVnode = Native('div', {}, []);
    const nextVnode = undefined;

    t.deepEqual(
        diffVnodes(prevVnode, nextVnode, 'root'),
        [
            RemoveNode(prevVnode)
        ]
    );
});

test('diffVnodes(): diffing text nodes', (t) => {
    const prevVnode = Text('foo');
    const nextVnode = Text('bar');

    t.deepEqual(
        diffVnodes(prevVnode, nextVnode, 'root'),
        [
            SetAttribute('nodeValue', 'bar', 'foo')
        ]
    );
});

test('diffVnodes(): diffing two nodes should diff attributes then children', (t) => {
    const prevVnode = Native('div', {}, []);
    const nextVnode = Native('div', { color: 'red' }, [
        Native('span', {}, [])
    ]);

    t.deepEqual(
        diffVnodes(prevVnode, nextVnode, 'root'),
        [
            SetAttribute('color', 'red', undefined),
            UpdateChildren([
                InsertChild(Native('span', {}, []), 0, 'root.0')
            ])
        ]
    );
});
