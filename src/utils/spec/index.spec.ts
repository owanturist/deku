import {
    isNull
} from 'utils';

describe('isNull()', () => {
    it('boolean', () => {
        expect(isNull(true)).toBe(false);
        expect(isNull(false)).toBe(false);
    });
});
