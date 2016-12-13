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
    Context,
    Vnode
} from 'vnode';
import {
    isNil
} from 'utils';

export function create<P, C>(container: HTMLElement, rootId = '0') {
    let prevVnode: Vnode<P, C>;
    let DOMNode: Node;

    function create(vnode: Vnode<P, C>, context: Context<C>): Node {
        DOMNode = createDOM(vnode, rootId, context);
        container.appendChild(DOMNode);
        prevVnode = vnode;

        return DOMNode;
    }

    function update(nextVnode: Vnode<P, C>, context: Context<C>): Node {
        const changes = diffVnodes(prevVnode, nextVnode, rootId);

        for (let change of changes) {
            DOMNode = updateDOM(DOMNode, change, context);
        }

        prevVnode = nextVnode;

        return DOMNode;
    }

    return (vnode: Vnode<P, C>, context?: Context<C>): Node => {
        return isNil(DOMNode) ?
            create(vnode, context) :
            update(vnode, context);
    };
}
