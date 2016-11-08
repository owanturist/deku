import {
    isNil,
    isNull,
    isUndefined,

    forEach,
    indexOf
} from 'utils';


describe('isNil()', () => {
    it('undefined', () => {
        expect(isNil(undefined)).toBeTruthy();
    });

    it('null', () => {
        expect(isNil(null)).toBeTruthy();
    });

    it('boolean', () => {
        expect(isNil(true)).toBeFalsy();
        expect(isNil(false)).toBeFalsy();
    });

    it('string', () => {
        expect(isNil('')).toBeFalsy();
        expect(isNil('foo')).toBeFalsy();
    });

    it('number', () => {
        expect(isNil(0)).toBeFalsy();
        expect(isNil(1)).toBeFalsy();
    });

    it('array', () => {
        expect(isNil([])).toBeFalsy();
        expect(isNil([ 'foo' ])).toBeFalsy();
    });

    it('object', () => {
        expect(isNil({})).toBeFalsy();
        expect(isNil({ foo: 'bar' })).toBeFalsy();
    });
});

describe('isNull()', () => {
    it('null', () => {
        expect(isNull(null)).toBeTruthy();
    });

    it('undefined', () => {
        expect(isNull(undefined)).toBeFalsy();
    });

    it('boolean', () => {
        expect(isNull(true)).toBeFalsy();
        expect(isNull(false)).toBeFalsy();
    });

    it('string', () => {
        expect(isNull('')).toBeFalsy();
        expect(isNull('foo')).toBeFalsy();
    });

    it('number', () => {
        expect(isNull(0)).toBeFalsy();
        expect(isNull(1)).toBeFalsy();
    });

    it('array', () => {
        expect(isNull([])).toBeFalsy();
        expect(isNull([ 'foo' ])).toBeFalsy();
    });

    it('object', () => {
        expect(isNull({})).toBeFalsy();
        expect(isNull({ foo: 'bar' })).toBeFalsy();
    });
});

describe('isUndefined()', () => {
    it('undefined', () => {
        expect(isUndefined(undefined)).toBeTruthy();
    });

    it('null', () => {
        expect(isUndefined(null)).toBeFalsy();
    });

    it('boolean', () => {
        expect(isUndefined(true)).toBeFalsy();
        expect(isUndefined(false)).toBeFalsy();
    });

    it('string', () => {
        expect(isUndefined('')).toBeFalsy();
        expect(isUndefined('foo')).toBeFalsy();
    });

    it('number', () => {
        expect(isUndefined(0)).toBeFalsy();
        expect(isUndefined(1)).toBeFalsy();
    });

    it('array', () => {
        expect(isUndefined([])).toBeFalsy();
        expect(isUndefined([ 'foo' ])).toBeFalsy();
    });

    it('object', () => {
        expect(isUndefined({})).toBeFalsy();
        expect(isUndefined({ foo: 'bar' })).toBeFalsy();
    });
});

describe('forEach()', () => {
    it('empty', () => {
        const array = [];
        const callbackfn = jest.fn();

        forEach(callbackfn, array);

        expect(callbackfn.mock.calls.length).toBe(0);
    });

    it('not empty', () => {
        const array = [
            'foo',
            'bar'
        ];
        const callbackfn = jest.fn();

        forEach(callbackfn, array);

        expect(callbackfn.mock.calls).toEqual([
            [ 'foo', 0, array ],
            [ 'bar', 1, array ]
        ]);
    });
});
