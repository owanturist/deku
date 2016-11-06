import * as deku from '../..';
import { assert } from 'chai';

import {
    render
} from 'string';

describe('String', () => {
    it('render to a string', () => {
        assert.equal(
            render(
                <div>
                    <span>foo</span>
                </div>
            ),
            '<div><span>foo</span></div>',
            'innerHTML rendered'
        );
    });

    it('render empty nodes to a string', () => {
        assert.equal(
            render(
                <div>
                    {null}
                </div>
            ),
            '<div><noscript></noscript></div>',
            'noscript rendered'
        );
    });

    it('render innerHTML to a string', () => {
        assert.equal(
            render(<div innerHTML='<span>foo</span>' />),
            '<div><span>foo</span></div>',
            'innerHTML rendered'
        );
    });

    it('render input.value to a string', () => {
        assert.equal(
            render(<input value='foo' />),
            '<input value="foo"></input>',
            'value rendered'
        );
    });

    it('render event attributes to a string', () => {
        assert.equal(
            render(<div onClick={() => 'blah'} />),
            '<div></div>',
            'attribute not rendered'
        );
    });

    it('render empty attributes to a string', () => {
        assert.equal(
            render(<input type='checkbox' value='' />),
            '<input type="checkbox" value=""></input>',
            'empty string attribute not rendered'
        );

        assert.equal(
            render(<input type='checkbox' value={0} />),
            '<input type="checkbox" value="0"></input>',
            'zero attribute not rendered'
        );

        assert.equal(
            render(<input type='checkbox' disabled={false} />),
            '<input type="checkbox"></input>',
            'false attribute not rendered'
        );

        assert.equal(
            render(<input type='checkbox' disabled={null} />),
            '<input type="checkbox"></input>',
            'null attribute not rendered'
        );

        assert.equal(
            render(<input type='checkbox' disabled={undefined} />),
            '<input type="checkbox"></input>',
            'undefined attribute not rendered'
        );

    });

    it('render thunks to a string', () => {
        let Component: any = {
            render: (model) => (
                <div>{model.props.name}</div>
            )
        };

        assert.equal(
            render(<Component name='Tom' />),
            '<div>Tom</div>',
            'Root level component rendered'
        );

    });

    it('render thunks with children to a string', () => {
        let Component: any = {
            render: (model) => (
                <div path={model.path}>{model.children}</div>
            )
        };

        assert.equal(
            render(
                <Component>
                    <div>Tom</div>
                </Component>
            ),
            '<div path="0"><div>Tom</div></div>',
            'rendered html'
        );

        assert.equal(
            render(
                <Component>
                    <div>
                        <Component key='foo'>
                            <span>Tom</span>
                        </Component>
                    </div>
                </Component>
            ),
            '<div path="0"><div><div path="0.0.foo"><span>Tom</span></div></div></div>',
            'rendered html'
        );

    });

    it('context should be passed down all elements when rendered as a string', () => {
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
                return <button>{context.hello}</button>;
            }
        };
        assert.equal(
            render(<Form />, { hello: 'there' }),
            `<div><h2>My form</h2><div><button>there</button></div></div>`
        );
    });
});
