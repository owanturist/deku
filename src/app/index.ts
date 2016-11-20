import Deku from 'types';

import {
    create as createDOM
} from 'dom/create';
import {
    update as updateDOM
} from 'dom/update';
import {
    diffVnodes
} from 'diff';
import {
    isNil
} from 'utils';

export function create(container: HTMLElement, dispatch?, rootId = '0') {
    let prevVnode: Deku.Vnode;
    let DOMNode: Node;

    function create(vnode: Deku.Vnode, context: any): Node {
        DOMNode = createDOM(vnode, rootId, dispatch, context);
        container.appendChild(DOMNode);
        prevVnode = vnode;

        return DOMNode;
    }

    function update(nextVnode: Deku.Vnode, context: any): Node {
        const changes = diffVnodes(prevVnode, nextVnode, rootId);

        for (let change of changes) {
            DOMNode = updateDOM(DOMNode, change, dispatch, context);
        }

        prevVnode = nextVnode;

        return DOMNode;
    }

    return (vnode: Deku.Vnode, context?): Node => {
        return isNil(DOMNode) ?
            create(vnode, context) :
            update(vnode, context);
    };
}
