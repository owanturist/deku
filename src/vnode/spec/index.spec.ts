import {
    Native,
    Text
} from 'vnode';

describe('Element', () => {
    describe('NativeElement', () => {
        it('lonely element', () => {
            expect(
                Native('div', {}, [])
            ).toEqual({
                type: 'NATIVE',
                tagName: 'div',
                attributes: {},
                children: []
            });
        });

        it('element with props', () => {
            expect(
                Native('div', {
                    width: '300px',
                    height: '400px'
                }, [])
            ).toEqual({
                type: 'NATIVE',
                tagName: 'div',
                attributes: {
                    width: '300px',
                    height: '400px'
                },
                children: []
            });
        });

        it('element with children', () => {
            expect(
                Native('div', {}, [
                    Text('string '),
                    Native('span', {}, []),
                    Text(' '),
                    Text('123')
                ])
            ).toEqual({
                type: 'NATIVE',
                tagName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'TEXT',
                        text: 'string '
                    },
                    {
                        type: 'NATIVE',
                        tagName: 'span',
                        attributes: {},
                        children: []
                    },
                    {
                        type: 'TEXT',
                        text: ' '
                    },
                    {
                        type: 'TEXT',
                        text: '123'
                    }
                ]
            });
        });
    });
});
