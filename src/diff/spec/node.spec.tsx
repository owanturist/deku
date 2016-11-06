import * as deku from '../..';
import { assert } from 'chai';

import {
    diffNode,
    Actions
} from 'diff';
import {
    createTextElement
} from 'element';

describe('Diff node', () => {
    it('diffing the same nodes should bail', () => {
        const prev = <div />;
        const next = prev;
        const actual = diffNode(prev, next)
        const expected = [
            Actions.sameNode()
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing nodes with different types', () => {
        const prev = <div />;
        const next = <span />;
        const actual = diffNode(prev, next);
        const expected = [
            Actions.replaceNode(prev, next, undefined)
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing node with null', () => {
        const prev = <div />;
        const next = null;
        const actual = diffNode(prev, next, '0');
        const expected = [
            Actions.replaceNode(prev, next, '0')
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing node with undefined', () => {
        const prev = <div />;
        const next = undefined;
        const actual = diffNode(prev, next, '0');
        const expected = [
            Actions.removeNode(prev)
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing text nodes', () => {
        const prev = createTextElement('foo');
        const next = createTextElement('bar');
        const actual = diffNode(prev, next, '0');
        const expected = [
            Actions.setAttribute('nodeValue', 'bar', 'foo')
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing with a current node as null', () => {
        const prev = null;
        const next = <div />;
        const actual = diffNode(prev, next, '0');
        const expected = [
            Actions.replaceNode(prev, next, '0')
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing two nodes should diff attributes then children', () => {
        const prev = <div />;
        const next = <div name='foo'><span /></div>;
        const actual = diffNode(prev, next, '0');
        const expected = [
            Actions.setAttribute('name', 'foo', undefined),
            Actions.updateChildren([
                Actions.insertChild(<span />, 0, '0.0')
            ])
        ];

        assert.deepEqual(actual, expected);
    });

    it('diffing thunks', () => {
        const RenderDiv: any = {
            render: () => <div />
        };
        const RenderSpan: any = {
            render: () => <span />
        };
        const first = <RenderDiv />;
        const second = <RenderDiv />;
        const third = <RenderSpan />;

        assert.deepEqual(
            diffNode(first, second, '0'),
            [
                Actions.updateThunk(first, second, '0')
            ],
            'update thunks of the same type'
        );

        assert.deepEqual(
            diffNode(first, third, '0'),
            [
                Actions.replaceNode(first, third, '0')
            ],
            'replace thunks of the different types'
        );
    });
});
