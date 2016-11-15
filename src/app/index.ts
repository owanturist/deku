import Deku from 'types';

import {
    create as createDOM
} from 'dom/create';

export function create(container: HTMLElement, dispatch?, rootId = '0') {
    return (vnode: Deku.Vnode, context?) => {
        const node = createDOM(vnode, rootId, dispatch, context);

        container.appendChild(node);

        return node;
    };
}
