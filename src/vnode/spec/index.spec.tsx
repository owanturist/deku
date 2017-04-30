import deku from '../../deku';

import {
    noop
} from 'utils';
import {
    NATIVE,
    THUNK,
    TEXT,
    EMPTY
} from 'vnode';


describe('Element', () => {
    describe('NativeElement', () => {
        it('lonely element', () => {
            expect(
                <div />
            ).toEqual({
                type: NATIVE,
                tagName: 'div',
                attributes: {},
                children: [],
                key: undefined
            });
        });

        it('element with key', () => {
            expect(
                <div key='key' />
            ).toEqual({
                type: NATIVE,
                tagName: 'div',
                attributes: {},
                children: [],
                key: 'key'
            });
        });

        it('element with props', () => {
            expect(
                <div width='300px' height='400px' />
            ).toEqual({
                type: NATIVE,
                tagName: 'div',
                attributes: {
                    width: '300px',
                    height: '400px'
                },
                children: [],
                key: undefined
            });
        });

        it('element with children', () => {
            expect(
                <div>
                    string <span /> {123} {null}
                </div>
            ).toEqual({
                type: NATIVE,
                tagName: 'div',
                attributes: {},
                children: [
                    {
                        type: TEXT,
                        text: 'string '
                    },
                    {
                        type: NATIVE,
                        tagName: 'span',
                        attributes: {},
                        children: [],
                        key: undefined
                    },
                    {
                        type: TEXT,
                        text: ' '
                    },
                    {
                        type: TEXT,
                        text: '123'
                    },
                    {
                        type: TEXT,
                        text: ' '
                    },
                    {
                        type: EMPTY
                    }
                ],
                key: undefined
            });
        });
    });

    describe('ThunkElement', () => {
        function Thunk() {
            return (
                <div></div>
            );
        }

        it('lonely element', () => {
            expect(
                <Thunk />
            ).toEqual({
                type: THUNK,
                render: Thunk,
                props: {},
                children: [],
                key: undefined
            });
        });

        it('element with key', () => {
            expect(
                <Thunk key={123} />
            ).toEqual({
                type: THUNK,
                render: Thunk,
                props: {},
                children: [],
                key: 123
            });
        });

        it('element with props', () => {
            expect(
                <Thunk foo='foo' bar={123} />
            ).toEqual({
                type: THUNK,
                render: Thunk,
                props: {
                    foo: 'foo',
                    bar: 123
                },
                children: [],
                key: undefined
            });
        });

        it('element with children', () => {
            expect(
                <Thunk key='parent'>
                    <Thunk key='child' />
                </Thunk>
            ).toEqual({
                type: THUNK,
                render: Thunk,
                props: {},
                children: [
                    {
                        type: THUNK,
                        render: Thunk,
                        props: {},
                        children: [],
                        key: 'child'
                    }
                ],
                key: 'parent'
            });
        });
    });
});
