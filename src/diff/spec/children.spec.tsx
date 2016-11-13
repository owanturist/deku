import * as deku from '../..';
import { assert } from 'chai';

import {
    diffChildren,
    Actions
} from 'diff';
import {
    createTextElement,
    createEmptyElement
} from 'vnode';

describe('Diff children', () => {
    it('insert text', () => {
        const actual = diffChildren(
            <div />,
            <div>foo</div>
        );
        const expected = Actions.updateChildren([
            Actions.insertChild(createTextElement('foo'), 0, '.0')
        ]);

        assert.deepEqual(actual, expected);
    });

    it('update text', () => {
        const actual = diffChildren(
            <div>foo</div>,
            <div>bar</div>
        );
        const expected = Actions.updateChildren([
            Actions.updateChild(0, [
                Actions.setAttribute('nodeValue', 'bar', 'foo')
            ])
        ]);

        assert.deepEqual(actual, expected);
    });

    it('insert element', () => {
        const actual = diffChildren(
            <div />,
            <div><span /></div>
        );
        const expected = Actions.updateChildren([
            Actions.insertChild(<span />, 0, '.0')
        ]);

        assert.deepEqual(actual, expected);
    });

    it('remove element', () => {
        const actual = diffChildren(
            <div><span /></div>,
            <div />
        );
        const expected = Actions.updateChildren([
            Actions.removeChild(0)
        ]);

        assert.deepEqual(actual, expected);
    });

    it('remove element with null', () => {
        const actual = diffChildren(
            <div><span /></div>,
            <div>{null}</div>
        );
        const expected = Actions.updateChildren([
            Actions.updateChild(0, [
                Actions.replaceNode(<span />, createEmptyElement(), '.0')
            ])
        ]);

        assert.deepEqual(actual, expected);
    });

    it('updated element with null', () => {
        const actual = diffChildren(
            <div>{null}</div>,
            <div>{null}</div>
        );
        const expected = Actions.updateChildren([]);

        assert.deepEqual(actual, expected);
    });

    it('add element from null', () => {
        const actual = diffChildren(
            <div>{null}</div>,
            <div><span /></div>
        );
        const expected = Actions.updateChildren([
            Actions.updateChild(0, [
                Actions.replaceNode(createEmptyElement(), <span />, '.0')
            ])
        ]);

        assert.deepEqual(actual, expected);
    });
});
