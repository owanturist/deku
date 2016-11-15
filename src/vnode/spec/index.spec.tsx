import deku from 'deku';

describe('Element', () => {
    describe('NativeElement', () => {
        it('lonely element', () => {
            expect(
                <div />
            ).toEqual({
                type: 'native',
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
                type: 'native',
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
                type: 'native',
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
                type: 'native',
                tagName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'string '
                    },
                    {
                        type: 'native',
                        tagName: 'span',
                        attributes: {},
                        children: [],
                        key: undefined
                    },
                    {
                        type: 'text',
                        text: ' '
                    },
                    {
                        type: 'text',
                        text: '123'
                    },
                    {
                        type: 'text',
                        text: ' '
                    },
                    {
                        type: 'empty'
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
                type: 'thunk',
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
                type: 'thunk',
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
                type: 'thunk',
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
                type: 'thunk',
                render: Thunk,
                props: {},
                children: [
                    {
                        type: 'thunk',
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
