import * as deku from '../..';
import { assert } from 'chai';

import {
    create as h,
    groupByKey
} from 'element';

describe('Element', () => {
    it('should accept strings as children', () => {
        const vnode = h('span', {}, [ 'hello' ]);

        assert.equal(vnode.children[0].type, 'text');
    });

    it('should not allow undefined as a vnode type', () => {
        assert.throws(() => h('span', {}, [ undefined ]));
    });

    it('groupByKey', () => {
        const children = [
            <div />,
            <div key='foo' />,
            <div />,
            undefined,
            null,
            'foo'
        ];

        const actual = groupByKey(children);
        const expented = [
            { key: '0', item: children[ 0 ], index: 0 },
            { key: 'foo', item: children[ 1 ], index: 1 },
            { key: '2', item: children[ 2 ], index: 2 },
            { key: '4', item: children[ 4 ], index: 4 },
            { key: '5', item: children[ 5 ], index: 5 }
        ];

        assert.deepEqual(actual, expented);
    });
});
