import * as deku from '../..';
import { assert } from 'chai';

import {
    diffAttributes,
    Actions
} from 'diff';

describe('Diff attributes', () => {
    it('add attribute action', () => {
        assert.deepEqual(
            diffAttributes(<div />, <div color='red' />),
            [
                Actions.setAttribute('color', 'red', undefined)
            ]
        );
    });

    it('update attribute action', () => {
        assert.deepEqual(
            diffAttributes(<div color='red' />, <div color='blue' />),
            [
                Actions.setAttribute('color', 'blue', 'red')
            ]
        );
    });

    it('remove attribute action', () => {
        assert.deepEqual(
            diffAttributes(<div color='red' />, <div />),
            [
                Actions.removeAttribute('color', 'red')
            ]
        );
    });

    it('update attribute action with false', () => {
        assert.deepEqual(
            diffAttributes(<div color='red' />, <div color={false} />),
            [
                Actions.setAttribute('color', false, 'red')
            ]
        );
    });

    it('update attribute action with null', () => {
        assert.deepEqual(
            diffAttributes(<div color='red' />, <div color={null} />),
            [
                Actions.setAttribute('color', null, 'red')
            ]
        );
    });

    it('update attribute action with undefined', () => {
        assert.deepEqual(
            diffAttributes(<div color='red' />, <div color={undefined} />),
            [
                Actions.setAttribute('color', undefined, 'red')
            ]
        );
    });

    it('no actions for same attribute values', () => {
        assert.deepEqual(
            diffAttributes(<div color='red' />, <div color='red' />),
            []
        );
    });

    it('update input value with zero value', () => {
        assert.deepEqual(
            diffAttributes(<input value='red' />, <input value={0} />),
            [
                Actions.setAttribute('value', 0, 'red')
            ]
        );
    });
});
